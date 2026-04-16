import { config } from "dotenv";

config()

const required = ['PORT','NODE_ENV']

for(key of required){
    if(!process.env[key])
        throw new Error(`Missing required environment variable: ${key}`)
}

export const ENV = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    isDev: process.env.NODE_ENV === 'development'
}