var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );



exports.regSuccess=function(req, res){
     res.render('Wlcm_user',{session:req.session,});
}

exports.logout=function(req,res){
    var loggedOutUser=req.session.username;
    req.session.destroy();
    console.log("Logged Out :"+loggedOutUser);
    res.render('Logout',{loggedOutUser:loggedOutUser});
}


exports.regUser=function(req,res){
   var username=req.body.username;
   var email=req.body.email;
   var password=req.body.password;
   var cnf_password=req.body.cnf_password;

   var newuser=new User();
   newuser.username=username;
   newuser.email=email;
   newuser.password=password;
   newuser.cnf_password=cnf_password;

   newuser.save(function(err,savedUser){
       if(err){
         console.log("User already exists with that username or email");
         var message="Select different username or email";
         res.render("Register",{errorMessage:message});
         return;
       }else{
         req.session.newuser=savedUser.username;
         res.render("Wlcm_user",{session:req.session});
       }
   });
}


exports.login=function(req,res){
    var email=req.body.email;
    var password=req.body.password;


    User.findOne({email:email}, function(err,user){
      if(user==null){
        console.log("User is null redirecting to login");
        var message="Invalid email or password";
        res.render("Login",{errorMessage:message});
        return;
      }


      user.comparePwd(password,function(err,isMatch){
        if(isMatch && isMatch==true){
          console.log("Authentication Sucessfull");
          req.session.username=user.username;
          req.session.loggedIn=true;
          console.log("Got User : "+req.session.username);
          res.render("Creat_Story",{session:req.session});
        }else{
          console.log("Authentication UnSucessfull");
          var message="Invalid email or password";
          console.log("Message :"+message);
          res.render("Login",{errorMessage:message});
          return;
        }
      });
    });
  }
