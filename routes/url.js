import shortid from 'shortid'
import { Router } from 'express'
import { Url } from '../models/url.js'

const urlRoute = Router()

// Generate New Short Url

urlRoute.post('/:userId', async (req, res) => {
    const { userId } = req.params
    const { url: longUrl } = req.body

    if (!longUrl) return res.status(400).json({ message: 'url is required' })
    if (!userId) return res.status(400).json({ message: 'userId is required' })

    try {
        const id = shortid()
        const urlDoc = await Url.create({
            shortId: id,
            redirectUrl: longUrl,
            createdBy: userId,
            anaylytics: [],
        })

        if (!urlDoc) {
            return res.status(400).json({ message: 'Something went wrong, Try Again' })
        }

        return res.json({ id, url: urlDoc })

    } catch (error) {
        console.error('Error creating URL:', error)
        return res.status(500).json({ message: 'Backend is Down', error: error.message })
    }
})


// Get Urls Created by User

urlRoute.get('/user-url/:id', async (req, res) => {

    const id = req.params.id

    try {
        const urls = await Url.find({ createdBy: id })

        if (!urls) return res.status(404).json({ message: 'No url found' })

        return res.status(200).json({ urls })

    } catch (error) {
        console.log('Error finding user url : ', error)
        return res.status(404).json({ message: 'Backend is Down', error: error.message })
    }
})

// Delete Url By User

urlRoute.delete('/:id', async (req, res) => {

    const { id } = req.params

    if (!id) return res.status(401).json({ message: 'Id is Required' })

    try {
        await Url.findByIdAndDelete(id)

        return res.status(201).json({ message: 'Url Deleted' })

    } catch (error) {
        return res.status(404).json({ message: 'Backend is Down', error: error.message })
    }
})


export default urlRoute