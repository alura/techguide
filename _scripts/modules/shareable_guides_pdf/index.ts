import { log } from "@scripts/modules/infra/log";
import * as fs from "fs";
import * as path from "path";
import puppeteer, { Browser } from "puppeteer";
import { parseMarkdownToHTML } from "./parseMarkdownToHTML";
import { processHtml } from "./htmlProcessor";
import { createHash } from "crypto";

// Function to load HTML template
function loadTemplate(): string {
  const templatePath = path.join(__dirname, "template.html");
  return fs.readFileSync(templatePath, "utf-8");
}

// Function to get all markdown files in a directory
function getMarkdownFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs.readdirSync(dirPath);
  return files.filter((file) => file.endsWith(".md"));
}

// Function to calculate content hash
function calculateContentHash(content: string): string {
  return createHash("md5").update(content).digest("hex");
}

// Function to check if PDF needs regeneration
function shouldRegeneratePDF(markdownPath: string, pdfPath: string): boolean {
  // If PDF doesn't exist, regenerate
  if (!fs.existsSync(pdfPath)) {
    return true;
  }

  // Read markdown content
  const markdownContent = fs.readFileSync(markdownPath, "utf-8");
  const currentHash = calculateContentHash(markdownContent);

  // Check if hash file exists and compare
  const hashPath = pdfPath.replace(".pdf", ".hash");
  if (fs.existsSync(hashPath)) {
    const storedHash = fs.readFileSync(hashPath, "utf-8");
    if (storedHash === currentHash) {
      return false; // Content hasn't changed
    }
  }

  return true; // Regenerate if hash doesn't match or doesn't exist
}

// Function to generate PDF for a single markdown file
async function generatePDFForFile(
  markdownPath: string,
  browser: Browser,
  template: string
): Promise<void> {
  const fileName = path.basename(markdownPath, ".md");
  const dirPath = path.dirname(markdownPath);
  const pdfPath = path.join(dirPath, `${fileName}.pdf`);

  log(`Processing: ${fileName}.md`);

  // Check if regeneration is needed
  if (!shouldRegeneratePDF(markdownPath, pdfPath)) {
    log(`✓ Skipped (no changes): ${fileName}.pdf`);
    return;
  }

  try {
    // Read the markdown file
    const markdownContent = fs.readFileSync(markdownPath, "utf-8");

    // Convert markdown to HTML
    const htmlContent = parseMarkdownToHTML({ markdown: markdownContent });

    // Process HTML with custom transformations
    const styledHtmlContent = processHtml(htmlContent);

    // Create the complete HTML document with fixed date for determinism
    const completeHtml = template
      .replace("{{content}}", styledHtmlContent)
      .replace("{{date}}", "2024-01-01"); // Fixed date for deterministic output

    // Save HTML file for debugging
    const htmlPath = path.join(dirPath, `${fileName}.html`);
    fs.writeFileSync(htmlPath, completeHtml);

    // Generate PDF with deterministic settings
    const page = await browser.newPage();

    // Set deterministic viewport and user agent
    await page.setViewport({ width: 1200, height: 800 });
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.setContent(completeHtml, { waitUntil: "networkidle0" });

    await page.pdf({
      path: pdfPath,
      format: "A4",
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
      printBackground: true,
      // Add deterministic settings
      preferCSSPageSize: false,
      displayHeaderFooter: false,
    });

    await page.close();

    // Save content hash for future comparison
    const contentHash = calculateContentHash(markdownContent);
    const hashPath = pdfPath.replace(".pdf", ".hash");
    fs.writeFileSync(hashPath, contentHash);

    log(`✓ Generated PDF: ${fileName}.pdf`);
  } catch (error) {
    log(`✗ Error processing ${fileName}.md: ${error}`);
  }
}

const main = async () => {
  try {
    log("Starting PDF generation for all markdown files...");

    // Define language directories
    const languages = ["PT_BR", "EN_US", "ES"];
    const downloadFilesPath = path.join(
      process.cwd(),
      "_data",
      "downloadFiles"
    );

    // Load template once
    const template = loadTemplate();

    // Launch browser once with deterministic settings
    log("Launching Puppeteer...");
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
      ],
    });

    let totalProcessed = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    // Process each language directory
    for (const language of languages) {
      const languagePath = path.join(downloadFilesPath, language);

      if (!fs.existsSync(languagePath)) {
        log(`Language directory not found: ${languagePath}`);
        continue;
      }

      log(`\nProcessing language: ${language}`);

      // Get all markdown files in this language directory
      const markdownFiles = getMarkdownFiles(languagePath);

      if (markdownFiles.length === 0) {
        log(`No markdown files found in ${language}`);
        continue;
      }

      log(`Found ${markdownFiles.length} markdown files`);

      // Process each markdown file
      for (const markdownFile of markdownFiles) {
        const markdownPath = path.join(languagePath, markdownFile);
        const pdfPath = markdownPath.replace(".md", ".pdf");

        if (shouldRegeneratePDF(markdownPath, pdfPath)) {
          await generatePDFForFile(markdownPath, browser, template);
          totalProcessed++;
        } else {
          totalSkipped++;
        }
      }
    }

    await browser.close();

    log(`\n=== PDF Generation Complete ===`);
    log(`Total files processed: ${totalProcessed}`);
    log(`Total files skipped (no changes): ${totalSkipped}`);
    log(`Total errors: ${totalErrors}`);
  } catch (error) {
    log(`Error in main process: ${error}`);
    process.exit(1);
  }
};

main();
