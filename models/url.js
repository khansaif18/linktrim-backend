import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    redirectUrl: {
        type: String,
        required: true,
    },
    anaylytics: [
        {
            timestamp: Date,
            device: {
                browser: String,
                platform: String,
                model: String
            },
            country: String,
        }, { _id: false }
    ],
    createdBy: {
        type: String,
        required: true,
    }

}, { timestamps: true })

export const Url = mongoose.model('url', urlSchema)


