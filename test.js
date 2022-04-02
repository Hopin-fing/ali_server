const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        product: 'firefox',
        headless: false,
        devtools: true
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const el = await page.waitForXPath(`//body//p`);


    console.log("test", el)

})();