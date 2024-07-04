import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;
// const path = require('path');

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(express.static("Public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


let posts = [];

function date() {
    let newdate = new Date();
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let date = newdate.toLocaleDateString('en-US', options);
    return date;
}


function createPost(title, content, date) {
    date = date();
    return { title: title, content: content, date: date };
}

app.get("/", (req, res) => {
    res.render("index.ejs", {
        posts: posts
    });
});

app.get("/view/:id", (req, res) => {
    const postID = req.params.id;
    const post = posts[postID];
    if (post) {
        res.render("partials/view.ejs", {
            post: post,
            index: postID
        });
    } else {
        res.status(404).send("Post not found");
    }
});

app.delete("/delete/:id", (req, res) => {
    const postID = parseInt(req.params.id, 10);
    if (posts[postID]) {
        posts.splice(postID, 1);
        res.redirect("/");
    } else {
        res.status(404).send("Post not found");
    }

});

app.post("/edit/:id", (req, res) => {
    const postID = parseInt(req.params.id, 10);
    const post = posts[postID];
    res.render("partials/create.ejs", {
        postID: postID,
        blogTitle: post.title,
        blogContent: post.content
    });
});

app.post("/update/:id", (req, res) => {
    const postID = parseInt(req.params.id, 10);
    let post = posts[postID];
    if (post) {
        post.title = req.body["blog-title"];
        post.content = req.body["blog-content"];
        res.redirect("/view/" + postID);
    } else {
        res.status(404).send("Post not Found"
        );
    }
});

app.get("/create", (req, res) => {
    res.render("partials/create.ejs");
});

app.post("/post", (req, res) => {

    const blogTitle = req.body["blog-title"];
    const blogContent = req.body["blog-content"];
    const newPost = createPost(blogTitle, blogContent, date);
    posts.push(newPost);

    res.render("index.ejs", {
        posts: posts,
    });
});


app.get("/blogs", (req, res) => {
    res.render("partials/blog.ejs", {
        posts: posts
    });
});


app.listen(port, () => {
    console.log(`Port is running on ${port}`);
});