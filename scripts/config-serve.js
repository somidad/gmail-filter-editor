const { readFileSync, writeFileSync } = require('fs')

const cspHash = readFileSync('csp-hash', 'utf8')
const hashes = Array.from(new Set(
	cspHash.split('\n')
	.filter((line) => line.startsWith('default-src'))
	.map((line) => line.replace('default-src: ', ''))
	.map((line) => line.replace(';', ''))
	.map((line) => line.split(' '))
	.flat()
))

const base = readFileSync('serve.base.json', 'utf8')
const config = base.replace('__HASHES__', hashes.join(' '))

writeFileSync('../docs/serve.json', config)

