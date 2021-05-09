const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", withAuth, (req, res) => {
  Post.findAll({
    where: {
      userId: req.session.userId,
    },
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render("all-posts-admin", {
        layout: "dashboard",
        posts,
        loggedIn: true,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/new", withAuth, (req, res) => {
  res.render("new-post", {
    layout: "dashboard",
  });
});

router.get("/edit/:id", withAuth, (req, res) => {
  Post.findByPk(req.params.id)
    .then((dbPostData) => {
      if (dbPostData) {
        const post = dbPostData.get({ plain: true });
        res.render("edit-post", { layout: "dashboard", post });
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;