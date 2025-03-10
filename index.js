const express= require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const dotenv = require("dotenv");
// const e = require("express");

const app=express();
dotenv.config();

const port=process.env.PORT || 3000;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.a5r70dy.mongodb.net/registrationformDB`,{
    // mongoose.connect('mongodb://localhost:3000/mydatabase', {
    // useNewUrlParser : true,
    // useUnifiedTopology : true,
});

// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

const registrationSchema = new mongoose.Schema({
    name:String,
    email:String,
    password: String
})

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true}));
app.use (bodyParser.json());


app.get("/",(req, res)=>{
    res.sendFile(__dirname + "/pages/index.html");
})



app.post("/register", async(req,res)=>{
    try{
        const{name,email,password} =req.body;

        const existingUser = await Registration.findOne({email : email});
        if(!existingUser){
            const RegistrationData = new Registration({
                name,
                email,
                password
            });
            await RegistrationData.save();
            res.redirect("/success");
        }
        else{
            console.log("user already exist");
            res.redirect("/error");
        }
     
    }
    catch(error){
        console.log(error)
            res.redirect("error");
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
})

app.get("/error",(req,res)=>{
    res.sendFile(__dirname + "/pages/error.html")
})

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})

