import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const envFilePath = resolve('src/environments/environment.production.ts')
const apiBaseUrl = process.env.NG_APP_API_BASE_URL?.trim()

if (!apiBaseUrl) {
  console.log('[set-env] NG_APP_API_BASE_URL no definido. Se mantiene environment.production.ts actual.')
  process.exit(0)
}

const fileContent = readFileSync(envFilePath, 'utf8')
const nextContent = fileContent.replace(
  /apiBaseUrl:\s*'[^']*'/,
  `apiBaseUrl: '${apiBaseUrl}'`
)

writeFileSync(envFilePath, nextContent, 'utf8')
console.log(`[set-env] apiBaseUrl actualizado en environment.production.ts -> ${apiBaseUrl}`)
