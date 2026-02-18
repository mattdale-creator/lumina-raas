import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = '/Users/hattr/Downloads';

const docs = [
  { html: 'PITCH_DECK.html', pdf: 'Lumina_RaaS_Pitch_Deck.pdf' },
  { html: 'CUSTOMER_VALIDATION_SURVEY.html', pdf: 'Lumina_RaaS_Customer_Survey.pdf' },
  { html: 'SALES_PLAYBOOK.html', pdf: 'Lumina_RaaS_Sales_Playbook.pdf' },
  { html: 'COMPETITOR_ANALYSIS.html', pdf: 'Lumina_RaaS_Competitor_Analysis.pdf' },
  { html: 'GTM_EXECUTION_PLAN.html', pdf: 'Lumina_RaaS_GTM_Plan.pdf' },
  { html: 'PRD_KNOWLEDGE_BASE.html', pdf: 'Lumina_RaaS_PRD_Knowledge_Base.pdf' },
];

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  
  for (const doc of docs) {
    const page = await browser.newPage();
    const htmlPath = path.join(__dirname, doc.html);
    const pdfPath = path.join(outputDir, doc.pdf);
    
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for fonts to load
    await page.waitForFunction(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 1000));
    
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      preferCSSPageSize: true,
    });
    
    console.log(`✅ Created: ${pdfPath}`);
    await page.close();
  }
  
  await browser.close();
  console.log(`\\n🎉 All PDFs saved to ${outputDir}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
