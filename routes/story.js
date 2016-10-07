var mongoose = require( 'mongoose' );
var Story = mongoose.model( 'Story' );


exports.stories = function(req,res){
             Story.find({}, function(err,stories){
               res.render('Home',{stories:stories,session:req.session});
             });
}


exports.insertStories = function(req, res){
    var title = req.body.title;
    var uri = req.body.imageLink;
    var summary = req.body.summary;
    var story = req.body.content;
    var author = req.session.username;
    console.log(author);


    var newStory = new Story();
    newStory.title=title;
    newStory.uri = uri;
    newStory.summary=summary;
    newStory.story=story;
    newStory.author=author;


    var convert = newStory.title.toLowerCase();
    var slug = convert.replace(/[^a-zA-Z0-9 ]/g, "");
    var final = slug.replace(/\s+/g, '-');

    newStory.slug=final;

    newStory.save(function(err,saved){
      if(err) {
        return res.status(500).send();
      }else{
        res.redirect("/stories");
      }

    });
}


exports.getStory=function(res, req){
  var path = req.params.story;
  Story.findOne({slug:path}, function(err,story){
    res.render('Stories',{session:req.session,story:story});
  });
}


exports.storeComment=function(res, req){
  var Slug = req.params.slug;
  var comments= req.body.comment;
  var created_at= new Date();

  Story.findOne({slug:Slug},function(err,story){
       Story.push.comments({body:comments,commented_by:req.session.username,date:created_at});

       Story.save(function(err,saved) {
         if(err){
           return res.status(500).send();
         }else{
           res.render('Stories',{session:req.session, story:story});
         }

       });
  });
}
