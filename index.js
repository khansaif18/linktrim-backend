import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { urlRoute } from './routes/url.js';
import { redirectToShortUrl } from './redirect.js';

dotenv.config()
const app = express()
const PORT = process.env.PORT

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB Connection Error', err));


app.use(cors({
    origin: 'https://linktrim-saif.vercel.app',
    // origin: ' http://localhost:5173',
    credentials: true
}))




app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.use('/api/v1/url', urlRoute)


app.get('/:shortId', redirectToShortUrl)


app.get('/', (req, res) => {
    res.json({ status: 'Server is running' })
})


app.listen(PORT, () => {
    console.log(`Server is Runnig at Port : http://localhost:${PORT}`);
})

