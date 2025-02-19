import { Router } from "express"
import { Url } from "../models/url.js"
import { UAParser } from 'ua-parser-js'
import axios from 'axios'
import deleteExpiredUrls from "../utils/deleteExpiredUrls.js"

const redirectRoute = Router()

const updateUrlAnalytics = async (id, ip, agent) => {
    try {
        const result = await axios.get(`https://ipinfo.io/${ip}?token=${process.env.IP_TOKEN}`)
        const { city, country } = result.data
        const regionInfo = result.data.bogon ? 'Unknow' : `${city}, ${country}`

        const parser = new UAParser(agent)
        const userAgentData = parser.getResult()

        const visitorData = {
            timestamp: new Date(),
            device: {
                browser: userAgentData.browser.name || 'Unknown',
                platform: userAgentData.os.name || 'Unknown',
                model: userAgentData.device.model || 'Unknown'
            },
            country: regionInfo,
        }

        await Url.findOneAndUpdate(
            { shortId: id },
            {
                $push: {
                    anaylytics: visitorData
                }
            },
            { new: true }
        )

    } catch (error) {
        throw new Error(error.message)
    }
}


redirectRoute.get('/:id', async (req, res) => { 
    const clientIp = req.ip
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'ID is Required' })

    try {
        deleteExpiredUrls()

        const entry = await Url.findOne({ shortId: id })

        if (!entry) {
            return res.status(404).send('Invalid or Expired Link')
        }

        updateUrlAnalytics(id, clientIp, req.headers['user-agent'])

        res.redirect(entry.redirectUrl)

    } catch (error) {
        return res.status(500).json({ message: 'Backend is Down', error: error.message })
    }
})


export default redirectRoute


// const clientIp = '27.97.27.202'