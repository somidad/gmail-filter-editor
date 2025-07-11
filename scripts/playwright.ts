import { chromium } from 'playwright'

(async () => {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    const hashes: string[] = []
    page.on('console', (consoleMsg) => {
        // TODO: Push a hash to `hashes`
    })
    await page.goto('http://localhost:3000')
    await page.goto('http://localhost:3000/help')
    await page.goto('http://localhost:3000/privacy')
    await page.goto('http://localhost:3000/nowhere')

    await page.close();
    await context.close();
    await browser.close();

    // TODO: Add it to CSP
})();
