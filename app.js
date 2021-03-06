//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);

app.get('/', (req, res)=>{
  res.render('home');
});

app.get('/login', (req, res)=>{
  res.render('login');
});

app.get('/register', (req, res)=>{
  res.render('register');
});

app.post('/register', (req, res)=>{
  User.findOne({email: req.body.userMail}, (err, foundUser)=>{
    if(!err){
      if(foundUser){
        console.log('The user already exists');
      }
      else {
        const newUser = new User({
          email: req.body.userMail,
          password: req.body.password
        });
        newUser.save();
        res.render('secrets');
      }
    }
    else{
      console.log(err);
    }
  });

});

app.post('/login', (req, res)=>{

  User.findOne({email: req.body.userMail, password: req.body.password}, (err, foundUser)=>{
    if(!err){
      if(foundUser){
        res.render('secrets');
      }
      else{
        console.log('User email or password worng!');
      }
    }
    else {
      console.log(err);
    }
  });


});





app.listen(3000, ()=>{
  console.log('Server started on port 3000.');
});
