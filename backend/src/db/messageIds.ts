import mongoose from "mongoose"

const MessageIdSchema = new mongoose.Schema({
    userSub: {type: String, required: true},
    messageId: {type: String, required: true},
})

export const MessageIdModel = mongoose.model("MessageId", MessageIdSchema)

// Methods to get messageIds by userSub
export const getMessageIdsBySub = (sub: string) => MessageIdModel.find({userSub: sub})

export const saveMessageIds = async (sub: string, messageIds: string[]) => {
    try {
        // Creating an array of objects to be inserted
        const messageIdsObjects = messageIds.map((messageId) => ({
            userSub: sub,
            messageId: messageId,
        }))

        const savedMessageIds =  await MessageIdModel.insertMany(messageIdsObjects)
        return savedMessageIds
    } catch (error) {
        throw new Error(`Error save the message ID: ${error}`)
    }
}