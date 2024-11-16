const express=require('express')
const cors=require('cors')
const cookieParser=require('cookie-parser')
require('dotenv').config()
const mongoose=require('mongoose')

const app=express()

const userRoute=require('./routes/userRoutes')
const adminRoute=require('./routes/adminRoutes')
app.use(cors({
    origin:'http://localhost:5173',
    methods: ['GET', 'POST','PUT','DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type']
}))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/',userRoute)
app.use('/',adminRoute)

mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
app.listen(4000,()=>{
    console.log('server running in the port')
})