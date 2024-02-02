const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
mongoose.connect("mongodb://localhost:27017/Session_Management");

const userSchema = mongoose.Schema({
    code: Number,
    name: String,
    Salary: Number
});

const user = mongoose.model("user", userSchema);
app.use(bodyParser.json());
app.use(express.json());

app.use(session({
    secret: "Key",
    resave:false,
    saveUninitialized: false,
    cookie: {secure: false},
}));

app.post('/register', async (req, res) => {
    try {
        const insertion = await user.create(req.body);
        res.status(200).json({ message: "New data inserted", data: insertion });
    } catch (err) {
        res.status(400).json({ message: "Error in insertion of data", error: err });
    }
});
app.get('/set-session', async (req,res)=>{
    try{
        const {code} = req.query;
        const sample_name = await user.findOne({code});
        if (sample_name) {
            req.session.user = sample_name.name;
            console.log('Session-data set:', req.session.user);
            res.send('Session-data set');
        } else {
            res.send('No user found');
        }
    }catch (err){
        res.status(400).json({err: "Error"});
    }
});

app.get('/get-session',async (req,res)=>{
    const user = req.session.user;
    if(user){
        res.send(JSON.stringify(user));
    }else{
        res.send('No session data found');
    }
});

app.listen(3000, ()=>{
    console.log("Listening to port number 3000");
})

