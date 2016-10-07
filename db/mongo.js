var chalk = require('chalk');
var mongoose = require( 'mongoose' );
var bcrypt=require('bcrypt');
var SALT_WORK_FACTOR = 10;

//var db="mongodb://palepnaren:naren539@ds035846.mlab.com:35846/stories-naren";
var db = "mongodb://localhost:27017/test";

mongoose.Promise = global.Promise;
mongoose.connect(db);

mongoose.connection.on("connected", function(){
  console.log(chalk.green("Mongoose connected to" +db));
});

mongoose.connection.on("error", function(err){
  console.log(chalk.red("Mongoose connection error" +err));
});

mongoose.connection.on("disconnected", function(){
  console.log(chalk.red("Mongoose disconnected with" +db));
});

//creating schema for user details.
var creatSchema = new mongoose.Schema({
    username:{unique:true, type:String},
    name:{type:String},
    email:{type:String, unique:true},
    password:String,
    cnf_passqord:String

});

creatSchema.pre('save', function(next){
  var user = this;
  console.log(chalk.blue("Before saving to database."));
//only checks if the has password is modifed or is it new
  if(!user.isModified('password'))
  return next();

//will generate a salt value with factor 10
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if(err) return next(err);


  bcrypt.hash(user.password,salt,function(err, hash){
    if(err) return next(err);


    user.password= hash;
    user.cnf_passqord=hash;

    console.log("The hash is " +hash);
    next();
  });
  });

});

//checks if both passwords matched while registering.
creatSchema.methods.match=function(err,isMatch){
  if(this.password==this.cnf_password)
  return isMatch();
}

//checks if the user entered the correct password
creatSchema.methods.comparePwd=function(userPassword,cd){
  bcrypt.compare(userPassword,this.password,function(err,isMatch){
    if(err) return cb(err);
    cd(null,isMatch);
  });
}


mongoose.model('User',creatSchema);



//creating schema for user story.
var storiesSchema = new mongoose.Schema({
  author:String,
  title: {type: String,unique:true},
  created_at:{type:Date,default:Date.now},
  summary:String,
  content:String,
  imageLink:String,
  comments:[{body:String,commented_by:String,date:Date}],
  slug:String
});

// Build the User model

mongoose.model('Story', storiesSchema,'stories');
