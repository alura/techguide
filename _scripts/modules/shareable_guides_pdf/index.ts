import { log } from "@scripts/modules/infra/log";
import * as fs from "fs";
import * as path from "path";
import puppeteer from "puppeteer";
import { parseMarkdownToHTML } from "./parseMarkdownToHTML";
import { processHtml } from "./htmlProcessor";

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

// Function to generate PDF for a single markdown file
async function generatePDFForFile(
  markdownPath: string,
  browser: puppeteer.Browser,
  template: string
): Promise<void> {
  const fileName = path.basename(markdownPath, ".md");
  const dirPath = path.dirname(markdownPath);

  log(`Processing: ${fileName}.md`);

  try {
    // Read the markdown file
    const markdownContent = fs.readFileSync(markdownPath, "utf-8");

    // Convert markdown to HTML
    const htmlContent = parseMarkdownToHTML({ markdown: markdownContent });

    // Process HTML with custom transformations
    const styledHtmlContent = processHtml(htmlContent);

    // Create the complete HTML document
    const completeHtml = template
      .replace("{{content}}", styledHtmlContent)
      .replace("{{date}}", new Date().toLocaleDateString("pt-BR"));

    // Save HTML file for debugging
    const htmlPath = path.join(dirPath, `${fileName}.html`);
    fs.writeFileSync(htmlPath, completeHtml);

    // Generate PDF
    const page = await browser.newPage();
    await page.setContent(completeHtml, { waitUntil: "networkidle0" });

    const pdfPath = path.join(dirPath, `${fileName}.pdf`);
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
    });

    await page.close();
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

    // Launch browser once
    log("Launching Puppeteer...");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    let totalProcessed = 0;
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
        await generatePDFForFile(markdownPath, browser, template);
        totalProcessed++;
      }
    }

    await browser.close();

    log(`\n=== PDF Generation Complete ===`);
    log(`Total files processed: ${totalProcessed}`);
    log(`Total errors: ${totalErrors}`);

  } catch (error) {
    log(`Error in main process: ${error}`);
    process.exit(1);
  }
};

main();
