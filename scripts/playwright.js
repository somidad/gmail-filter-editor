const { chromium } = require('playwright')

const SRC_PATTERN = /Note (also )?that '(.+?)' was not explicitly set/
const SCRIPT_URL_PATTERN = /Refused to load the script '(.+?)' because/
const SCRIPT_HASH_PATTERN = /a hash \(('.+?')\)/

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
        const text = consoleMsg.text()

        const srcMatch = text.match(SRC_PATTERN)
        if (!srcMatch) return
        const src = srcMatch[2]
        if (!(src in pathRef)) pathRef[src] = []

        const urlMatch = text.match(SCRIPT_URL_PATTERN)
        if (urlMatch) {
            const url = urlMatch[1]
            pathRef[src].push(url)
            return;
        }

        const hashMatch = text.match(SCRIPT_HASH_PATTERN)
        if (hashMatch) {
            const hash = hashMatch[1]
            pathRef[src].push(hash)
            return;
        }
    })

    for (const path of PATHS) {
        hashes[path] = {}
        pathRef = hashes[path]
        await page.goto(`http://localhost:3000${path}`)
        for (const key in pathRef) {
            pathRef[key] = Array.from(new Set(pathRef[key]))
        }
    }

    await page.close();
    await context.close();
    await browser.close();

    console.log(hashes)
    // TODO: Add it to CSP
}

main()
