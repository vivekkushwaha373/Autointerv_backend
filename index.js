const express = require('express');
const cookieParser=require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));



// Use CORS middleware
app.use(cors({
    origin: process.env.ORIGIN, // Allow only frontend requests from this origin
    credentials: true, // Optional if you're using cookies or authentication headers
}));



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('App started at port no ', PORT);
})

const { connectDb } = require('./config/database');
const { disconnectDb } = require('./config/database');

connectDb();

const routes = require('./route/userRoutes');
const chatroutes = require('./route/chatRoutes');
const interviewroutes = require('./route/interviewRoutes');
app.use('/api/v1', routes);
app.use('/api/v1', chatroutes);
app.use('/api/v1', interviewroutes);


app.get('/', (req, res) => {
     return res.send('<H1>Hello DOSTON This is Vivek</H1>')
})
