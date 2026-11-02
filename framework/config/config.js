import dotenv from 'dotenv'

dotenv.config()

const config = {
  baseUrl: process.env.BASE_URL,
  userName: process.env.USERNAME,
  current_password: process.env.PASSWORD,
  invalid_password: process.env.INVALID_PASSWORD,
}

export default config
