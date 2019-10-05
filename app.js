var bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer");
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();


//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("blog", blogSchema);

//RESTFUL ROUNTES

app.get("/", function(req, res){
    res.redirect("/blogs");
});


//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!!!");
        }else{
            res.render("index", {blogs: blogs});
        }
    })
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new")
})

//CREATE ROUTE
app.post("/blogs", function(req, res){
    console.log(req.body)
    console.log("===============")
    console.log(req.body)
    var blogStar = req.body.blog;
    Blog.create(blogStar, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            //then, redirect to index
            res.redirect("/blogs")
        }

    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    var id = req.params.id;
    Blog.findById(id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("show", {blog: foundBlog});
        }
    })
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    var id = req.params.id;
    Blog.findById(id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("edit", {blog: foundBlog});
        }
    })
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var id = req.params.id;
    var body = req.body.blog;
    Blog.findByIdAndUpdate(id, body, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs")
        }else{
            res.redirect("/blogs/" + id);
        }
    })
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //destroy blog
    var id = req.params.id;
    Blog.findByIdAndRemove(id, function(err){
        if(err){
            res.redirect("/blogs")
        }else{
            res.redirect("/blogs")
        }
    })
    //redirect somehwere
});

//PORT CONFIG
app.listen(3030, function(){
    console.log("SERVER IS UP AND RUNNING!!!");
});