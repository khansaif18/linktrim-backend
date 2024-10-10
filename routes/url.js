import { Url } from '../models/url.js';
import shortid from 'shortid';
import { Router } from 'express'

export const urlRoute = Router()

// handleGenerateNewShortUrl

urlRoute.post('/', async (req, res) => {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'url is required' });
    if (!body.userId) return res.status(400).json({ error: 'userId is required' });

    try {
        const id = shortid();
        const url = await Url.create({
            shortId: id,
            redirectUrl: body.url,
            createdBy: body.userId,
            visitHistory: [],
        });
        return res.json({ status: 'success', id: id });
    } catch (error) {
        console.error('Error creating URL:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})


// handlegetUrlsCreatedbyUser

urlRoute.get('/user-url/:id', async (req, res) => {
    const id = req.params.id
    try {
        const userUrls = await Url.find({ createdBy: id })
        if (!userUrls) return res.status(404).json({ status: 'No url found' })
        else return res.status(200).json(userUrls)
    } catch (error) {
        console.log('Error finding user url : ', error);
        return res.status(404).json({ status: 'Some error occured' })
    }
})

// handleDeleteUrlByUser

urlRoute.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    if (!id) return res.status(401).json({ error: 'id is required' })
    try {
        await Url.findByIdAndDelete(id)
        return res.status(201).json({ status: 'url deleted successfully' })
    } catch (error) {
        return res.status(404).json({ error: 'Some error occured, could not delete url' })
    }
})



// for testing purpose
urlRoute.get('/my-all-urls', async (req, res) => {
    try {
        const urls = await Url.find({})
        if (!urls) return res.status(404).json({ status: 'No url found' })
        else return res.status(200).json(urls)
    } catch (error) {
        console.log('Error finding user url : ', error);
        return res.status(404).json({ status: 'Some error occured' })
    }
})