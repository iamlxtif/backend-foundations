import express from 'express'
import { config } from 'dotenv'
import { errorHandler } from './middleware/errorHandler'
import morgan from 'morgan'

config()

const app = express()
app.use(express.json())
app.use(morgan('dev'))

app.get('/health',(req,res) => {
    res.json({status: 'ok', timestamp: new Date().toISOString()})
})

app.use(errorHandler);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))