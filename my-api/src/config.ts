import { config } from 'dotenv'
import { resolve } from 'path'

export const nodeEnv = process.env.NODE_ENV || 'development'
const envFile = nodeEnv === 'development' ? '.env.development' : '.env'

config({ path: resolve(__dirname, `../${envFile}`) })
config({ path: resolve(__dirname, `../${envFile}.local`), override: true })

export const port = process.env.PORT || 8000
export const DBUrl = process.env.DATABASE_URL