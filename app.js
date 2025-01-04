const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const authRouter = require('./Routes/authRouter');


const app = express();




app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1',authRouter)
module.exports=app;