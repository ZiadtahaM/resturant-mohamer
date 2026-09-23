import Chat from '../../../DB/models/chat.model.js'
import {GoogleGenerativeAI} from "@google/generative-ai"
import {asynchandler} from '../../utils/asyncHandler.js'
import { chatSchema } from './chatbot.schema.js'
import meals from '../../../DB/models/meals.model.js'

const createChat = asynchandler(async (req,res) =>{
    const {userId} = req.body;
    const newChat = await Chat.create({
        userId,
    })

    res.status(201).json({
        status:'success',
        data:{
            chat: newChat
        }
    })
})

const readChat = asynchandler(async(req,res) =>{
    const userChat = await Chat.findOne({userId:req.user._id});
    res.status(200).json({
        status:'success',
        data:{
            userChat
        }
    })
})

const updateChat = asynchandler(async(req,res) =>{
    const {history} = req.body;

    const updatedChat = await Chat.findOne({userId:req.user._id})

    const completeHistory = [...updatedChat.history,...history];

    updatedChat.history = completeHistory;
    await updatedChat.save();

    res.status(200).json({
        status:'success',
        data:{
            updatedChat
        }
    })
})

const deleteChat = asynchandler(async(req,res) =>{
    
    const deletedChat = await Chat.find({userId:req.user._id})
    res.status(200).json({
        status:'success',
        data:{
            deletedChat
        }
    })
})

// Normal MVC CRUD


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
const systemPrompt = `You are an AI assistant for a restaurant application for Mohamer Restaurant.
Your primary role is to help users choose food from the restaurant menu.

Rules you MUST follow:
1. ONLY recommend items that exist in the provided menu.
2. NEVER invent dishes, ingredients, prices, or categories.
3. If the user asks for something not on the menu, politely say it is not available and suggest the closest alternatives from the menu.
4. Ask clarifying questions when needed (e.g. spicy vs mild, vegetarian vs meat).
5. Keep responses short, friendly, and helpful.
6. Do not repeat the full menu unless the user explicitly asks for it.
7. Remember User prefernces from the chat history you'll be provided with.
8. 
`

const chatWithBot =  async(userMessage, menuItems=[],chatHistory=[])=>{
    try{
        const model =  genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig:{
                temperature:0.7, // ðŸ‘ˆControls the creativity of responses
                topK:1, // ðŸ‘ˆControls the diverstiy of responses
                maxOutputTokens:800 // ðŸ‘ˆ Controls the length of responses
            }
        })

        const context = `${systemPrompt}  \n\n Our Menu: ${JSON.stringify(menuItems)}`
        const historyMessage  = chatHistory.map((chat)=>{
            return {
                role:chat.role == 'user' ? 'user' : 'model',
                parts:[{text: chat.message}]
            }
        })
        const systemMessage = { role:'user', 
            parts:[{
                text:context
            }]
        }
        const chat = model.startChat({
            history: [systemMessage, ...historyMessage]
        })

        const result = await chat.sendMessage(userMessage) //ðŸ‘ˆ Return an object with keys: [response, feedback, functioncalls]
        const response =  result.response //
        
        return response.text()
    }catch(err){
        console.log(`Error from ChatSetup: ${err}`)
    }
}

// Function to handle chatbot requests
const chatbot = asynchandler(async (req, res) => {
    const userMessage = req.body.userMessage
    // ðŸ‘‡All the meals in the db, so the chatbot can recommend from it
    const menuItems  = await meals.find() 
    // const menuItems = [
    //     { name: "Grilled Chicken Salad", ingredients: ["chicken", "lettuce", "tomatoes", "cucumbers"], allergens: ["none"] },
    //     { name: "Vegan Buddha Bowl", ingredients: ["quinoa", "chickpeas", "avocado", "mixed greens"], allergens: ["none"] },
    //     { name: "Spaghetti Bolognese", ingredients: ["spaghetti", "ground beef", "tomato sauce", "parmesan"], allergens: ["gluten", "dairy"] },
    //     { name: "Gluten-Free Margherita Pizza", ingredients: ["gluten-free crust", "tomato sauce", "mozzarella", "basil"], allergens: ["dairy"] },
    // ]
    // ðŸ‘‡Retreives all the chat so it can be used 
    
    let userChat = await Chat.findOne({ userId: req.user._id });

    if(!userChat){
        userChat = await Chat.create({ userId: req.user._id });
    }

    const { error, value } = chatSchema.validate(
    {
        history: userChat.history || [],
        userMessage
    },
    { abortEarly: false }
    )

    if (error) {
        return res.status(400).json({
        status: 'fail',
        errors: error.details.map(err => err.message)
        })
    }



    // ðŸ‘‡Speak with the model, given our menu & chat history
    const response = await chatWithBot(userMessage, menuItems, userChat.history)

    // ðŸ‘‡Updates the chat in the db to append the last convo. to that specific user history 
    const completeHistory = [...userChat.history, { role: 'user', message: userMessage }, { role: 'bot', message: response }];
    userChat.history = completeHistory;
    await userChat.save();

    res.status(200).json({
        status: 'success',
        data: {
            message: response
        }
    })
})

// Router: router.post('/chatbot',)

export default { 
    chatbot,
    createChat,
    readChat,
    updateChat,
    deleteChat 
};