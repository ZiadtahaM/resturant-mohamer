import dotenv from 'dotenv';
import express from 'express';
import bootstrap from './src/bootstrap.js';
dotenv.config({ path: './.env' , quiet:true}); // Added quiet:true to remove the message with the server starts
const app = express();

const port = process.env.PORT || 3000;

await bootstrap(app, express); 


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.get('/', (req, res) => res.send('Hello World!'));
