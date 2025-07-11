const { chromium } = require('playwright')

const PATHS = [
    '/',
    '/help',
    '/privacy',
    '/nowhere'
]

async function main() {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    const hashes = {}
    let pathRef = undefined
    page.on('console', (consoleMsg) => {
        // TODO: Push a hash to `hashes`
    })

    for (const path of PATHS) {
        hashes[path] = {}
        pathRef = hashes[path]
        await page.goto(`http://localhost:3000${path}`)
    }

    await page.close();
    await context.close();
    await browser.close();

    // TODO: Add it to CSP
}

main()
