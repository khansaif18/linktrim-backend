import { Url } from "../models/url.js"

const deleteExpiredUrls = async () => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

        const result = await Url.deleteMany({
            createdAt: { $lt: sevenDaysAgo },
            createdBy: 'unsigned-user'
        })

        console.log(`Deleted ${result.deletedCount} expired URLs`)
    } catch (error) {
        console.error('Error deleting expired URLs:', error)
    }
}

export default deleteExpiredUrls