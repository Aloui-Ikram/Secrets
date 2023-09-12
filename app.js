require('dotenv').config();
const express = require("express");
const bodyParser = require ("body-parser");
const mongoose = require ("mongoose"); 
var encrypt = require('mongoose-encryption');
const ejs =require("ejs");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/usersDB");
const userSchema= new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET ,  encryptedFields: ['password']});


const User =mongoose.model("User", userSchema)
app.get("/",function(req,res){
    res.render("home")
});

app.get("/login",function(req,res){
    res.render("login")
});
app.get("/register",function(req,res){
    res.render("register")
});

app.post("/register",function(req,res){
    const newUser= new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save({})
    .then(reslt => {
       res.render("secrets");
     })
   
   .catch(error => console.error(error));
})
// app.post("/login",function(req,res){
//     const username = req.body.username;
//     const password=req.body.password;
//     User.findOne({email:username},function(err,founduser){
//         if (err){
//             console.log(err);
//         }else {
//         if(founduser){
//             if (founduser.password===password){
//                 res.render("secrets")
//             }
//         }
//     }
//     }
//     )
// });
app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
  
    User.findOne({email: username})
      .then(founduser => {
        if (founduser) {
          if (founduser.password === password) {
            res.render("secrets");
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
   







app.listen(3000,function(){
    console.log("server running in port 3000");
});