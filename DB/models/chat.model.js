import mongoose from 'mongoose'

const chatSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required:[true,'User ID is required'],
        ref:'User'
    },
    history: {
        type: Array,
        required:[true,'Conversation is required'],
        default:[]
    },
})

const Chat = mongoose.model('Chat',chatSchema);

export default Chat;