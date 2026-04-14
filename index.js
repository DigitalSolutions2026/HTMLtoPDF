const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/api/generate', async (req, res) => {
  const { html } = req.body;
  if (!html) {
    return res.status(400).send('Missing "html" field');
  }

  let browser;
  try {
    browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).send('PDF generation failed');
  } finally {
    if (browser) await browser.close();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
