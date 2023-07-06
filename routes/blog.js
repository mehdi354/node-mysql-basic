const express = require("express");

const db = require("../util/database");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/posts");
});

router.get("/posts", async (req, res) => {
  //   const query = "SELECT * from posts";
  const query = `SELECT posts.* , authors.name AS author_name, authors.email AS author_email
  FROM posts INNER JOIN authors
  ON posts.author_id = authors.id
  `;
  const [posts] = await db.query(query);
  console.log(posts);
  res.render("posts-list", { posts: posts });
});

router.get("/posts/:id", async (req, res) => {
  const query = `
    SELECT posts.*, authors.id AS author_id,  authors.email AS author_email
    FROM posts INNER JOIN authors
    ON posts.id = authors.id
    WHERE posts.id = ?
    `;
  const [posts] = await db.query(query, [req.params.id]);
  const postData = {
    ...posts[0],
    date: posts[0].date.toISOString(),
    humanReadableDate: posts[0].date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
  console.log(posts);
  res.render("post-detail", { post: postData });
});

router.get("/new-post", async (req, res) => {
  const query = "SELECT * FROM authors";
  const [authors] = await db.query(query);
  res.render("create-post", {
    authors: authors,
  });
});

router.post("/new-post", async (req, res) => {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  const query = `
  INSERT INTO posts (title,summary,body,author_id)
  VALUES (?)
  `;

  const post = await db.query(query, [data]);

  console.log(post);

  res.redirect("/posts");
});

router.get("/posts/:id/edit", async (req, res) => {
  const query = `
  SELECT posts.* , authors.id AS author_id , authors.email AS author_email
  FROM posts INNER JOIN authors
  ON posts.id = authors.id
  WHERE posts.id=?
  `;
  const [post] = await db.query(query , [req.params.id])

  res.render("update-post" , {
    post: post[0]
  });
});

router.post("/posts/:id/edit",async(req, res) => {
  const query = `UPDATE posts SET title=?,summary=?,body=? WHERE id=?`;

  await db.query(query , [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.id
  ])

  res.redirect("/posts");
});

router.post("/posts/:id/delete", async (req, res) => {
  const query = "DELETE FROM posts WHERE id = ?";
  await db.query(query, [req.body.id]);
  res.redirect("/posts");
});

module.exports = router;
