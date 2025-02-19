import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import databaseConnection from './config/db.js'
import redirectRoute from './routes/redirect.js'
import urlRoute from './routes/url.js'
import mongoose from 'mongoose'

const app = express()

app.set('trust proxy', true)

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))


app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.get('/', (req, res) => {
    res.json({ status: 'Server is running' })
})

app.use(async (req, res, next) => {
    try {
        await databaseConnection()
        if (!mongoose.connection.readyState === 1) {
            throw new Error('Database connection not ready')
        }
        next()
    } catch (error) {
        res.status(503).json({ message: "Database connection failed", error: error.message })
    }
})

app.use('/u', redirectRoute)
app.use('/api/v2/url', urlRoute)


app.listen(process.env.PORT, () => {
    console.log(`Server is Runnig at Port : http://localhost:${process.env.PORT}`)
})