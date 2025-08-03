const { writeFileSync } = require("fs");
const { chromium } = require("playwright");

const PATHS = ["/", "/help", "/privacy", "/nowhere"];

let pathRef;
const handleConsoleMsg = (consoleMsg) => {
  const SRC_PATTERN = /Note (also )?that '(.+?)' was not explicitly set/;
  const SCRIPT_URL_PATTERN = /Refused to load the script '(.+?)' because/;
  const SCRIPT_HASH_PATTERN = /a hash \(('.+?')\)/;

  const text = consoleMsg.text();

  const srcMatch = text.match(SRC_PATTERN);
  if (!srcMatch) return;
  // const src = srcMatch[2];
  const src = "default-src"; // Always use default-src for simplicity
  if (!(src in pathRef)) pathRef[src] = [];

  const urlMatch = text.match(SCRIPT_URL_PATTERN);
  if (urlMatch) {
    const url = urlMatch[1];
    pathRef[src].push(url);
    return;
  }

  const hashMatch = text.match(SCRIPT_HASH_PATTERN);
  if (hashMatch) {
    const hash = hashMatch[1];
    pathRef[src].push(hash);
    return;
  }
};

const buildCloudflareWorker = (hashes) => {
  const HEADERS = [
    {
      key: "Access-Control-Allow-Origin",
      value: "https://gfilter.app",
    },
    {
      key: "Cross-Origin-Opener-Policy",
      value: "same-origin-allow-popups",
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "Permissions-Policy",
      value:
        "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), fullscreen=(), display-capture=(), midi=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), xr-spatial-tracking=(), autoplay=(), clipboard-read=(), clipboard-write=(), gamepad=()",
    },
  ];
  const SELF_WITH_QUOTE = "'self'";

  const headers = PATHS.map((path) => {
    const source =
      path === "/nowhere" ? "      default:" : `      case '${path}':`;
    const headers = structuredClone(HEADERS);
    const csp = {
      "default-src": SELF_WITH_QUOTE,
      // "connect-src": SELF_WITH_QUOTE,
      // "form-action": SELF_WITH_QUOTE,
      // "frame-ancestors": SELF_WITH_QUOTE,
      // "frame-src": SELF_WITH_QUOTE,
    };
    for (const src in hashes[path]) {
      if (!(src in csp)) {
        csp[src] = SELF_WITH_QUOTE;
      }
      csp[src] = [csp[src], ...hashes[path][src]].join(" ");
    }
    headers.push({
      key: "Content-Security-Policy",
      value: Object.entries(csp)
        .map(([key, value]) => `${key} ${value};`)
        .join(" "),
    });
    const statements = headers.map((header) => {
      return `        newResponse.headers.set("${header.key}", "${header.value}");`;
    });
    if (source !== "default:") statements.push("        break;");
    return [source, statements.join("\n")].join("\n");
  }).join("\n");

  const worker = `
export default {
  async fetch(request) {
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    const url = new URL(request.url);
    const pathname = url.pathname.toLocaleLowerCase();
    switch (pathname) {
${headers}
    }
    return newResponse;
  }
}
`;
  writeFileSync("../cf-worker/src/index.js", worker);
};

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const hashes = {};
  page.on("console", handleConsoleMsg);

  for (const path of PATHS) {
    hashes[path] = {};
    pathRef = hashes[path];
    if (path === "/") {
      pathRef["default-src"] = [
        "https://apis.google.com",
        "https://accounts.google.com",
        "https://content.googleapis.com",
        "https://gmail.googleapis.com",
      ];
    }
    await page.goto(`http://localhost:3000${path}`);
    for (const key in pathRef) {
      pathRef[key] = Array.from(new Set(pathRef[key]));
    }
  }

  await page.close();
  await context.close();
  await browser.close();

  buildCloudflareWorker(hashes);
}

main();
