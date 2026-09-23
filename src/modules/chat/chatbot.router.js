// If this folder will be in 'Routes' folder and the fns in the 'Controllers' folder ❌❌
// Feature-based folder Structure: a module folder containing the chatbot's con. routes and joi validation (chatbot.schema.js)
import chatCon from './chatbot.controller.js'
import auth  from '../middlewares/auth.js' //👈 The Protect MW
import express from 'express'
import role from '../middlewares/role.js';
const router = express.Router()

router.route('/chatbot').post(auth,chatCon.chatbot)

router.route('/createChat').post(auth,role("ADMIN"),chatCon.createChat)

router.route('/readChat').get(auth,chatCon.readChat)


router.route('/updateChat').patch(auth,role("ADMIN"),chatCon.updateChat);

router.route('/deleteChat/:userId').delete(auth,chatCon.deleteChat)

export default router