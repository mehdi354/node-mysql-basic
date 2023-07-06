const express = require("express");
const path = require("path");
const app = express();

const blogRoutes = require("./routes/blog");

// EJS Render
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(blogRoutes);

app.listen(8000);
