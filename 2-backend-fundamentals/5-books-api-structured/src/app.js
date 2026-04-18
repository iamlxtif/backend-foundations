import express from 'express'
import { config } from 'dotenv'
import { errorHandler } from './middleware/errorHandler.js'
import morgan from 'morgan'
import booksRouter from './routes/book.routes.js'
import helmet from 'helmet'
import { apiLimiter } from './middleware/rateLimiter.js'

config()
const app = express()

app.use(helmet())

app.use(express.json())

app.use(morgan('dev'))

app.use('/api', apiLimiter)

app.get('/health', (req, res) => {
    res.json({status: 'ok', timestamp: new Date().toISOString()})
})

app.use('/api/books', booksRouter)

app.use(errorHandler);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))