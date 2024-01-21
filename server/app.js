import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    Credential: true
}));

app.use(cookieParser());
app.use(morgan('dev'));

app.use('/ping', function(req,res){
    res.send('/pong');
});


//  route of 3 module 

app.all('*', (req,res)=>{
    res.status(404).send("OOPS! 404 page not found");
});


export default app;