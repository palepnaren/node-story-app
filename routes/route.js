var mongoose = require( 'mongoose' );
var Story = mongoose.model( 'Story' );

exports.main=function(req, res){
      res.render('Main', {session:req.session});
}
exports.home=function(req,res){
             Story.find({}, function(err,stories){
                  res.render('Home',{stories:stories});
              });
}


exports.login=function(req, res){
  res.render('Login');
}
exports.register=function(req, res){
  res.render('Register');
}

exports.tech=function(req, res){
  res.render('Tech',{session:req.session});
}
exports.newStory=function(req,res){
          if(req.session.loggedIn !== true){
            console.log("Logged In :"+req.session.loggedIn);
            res.redirect('/login');
          }else{
              res.render('Creat_Story',{session:req.session});
          }

    }
