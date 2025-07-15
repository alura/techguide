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

const main = async () => {
  try {
    log("Starting PDF generation for Agile guide...");

    // Read the markdown file
    const markdownPath = path.join(
      process.cwd(),
      "_data",
      "downloadFiles",
      "PT_BR",
      "agile.md"
    );
    log(`Reading markdown file from: ${markdownPath}`);

    if (!fs.existsSync(markdownPath)) {
      throw new Error(`Markdown file not found: ${markdownPath}`);
    }

    const markdownContent = fs.readFileSync(markdownPath, "utf-8");
    log("Markdown file read successfully");

    // Convert markdown to HTML using the parseMarkdownToHTML function
    const htmlContent = parseMarkdownToHTML({ markdown: markdownContent });

    // Process HTML with custom transformations
    const styledHtmlContent = processHtml(htmlContent);
    log("Markdown converted to HTML");

    // Load template and create the complete HTML document
    const template = loadTemplate();
    const completeHtml = template
      .replace("{{content}}", styledHtmlContent)
      .replace("{{date}}", new Date().toLocaleDateString("pt-BR"));

    // Get the directory where the markdown file is located
    const markdownDir = path.dirname(markdownPath);

    // Save HTML file for debugging
    const htmlPath = path.join(markdownDir, "agile.html");
    fs.writeFileSync(htmlPath, completeHtml);
    log(`HTML file saved to: ${htmlPath}`);

    // Generate PDF using Puppeteer
    log("Launching Puppeteer...");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set content and wait for rendering
    await page.setContent(completeHtml, { waitUntil: "networkidle0" });

    // Generate PDF in the same directory as the markdown file
    const pdfPath = path.join(markdownDir, "agile.pdf");
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

    await browser.close();
    log(`PDF generated successfully: ${pdfPath}`);
  } catch (error) {
    log(`Error generating PDF: ${error}`);
    process.exit(1);
  }
};

main();