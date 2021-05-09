const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

router.post("/", (req, res) => {
  User.create({
    name: req.body.name,
    password: req.body.password,
  })
    .then((dbUserData) => {
      req.session.save(() => {
        req.session.userId = dbUserData.id;
        req.session.name = dbUserData.name;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })

    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/login", (req, res) => {
  User.findOne({
    where: {
      name: req.body.name,
    },
  }).then((dbUserData) => {
    if (!dbUserData) {
      res.status(400).json({ message: "No user with that username!" });
      return;
    }
    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect password!" });
      return;
    }

    req.session.save(() => {
      req.session.userId = dbUserData.id;
      req.session.name = dbUserData.name;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: "logged in!" });
    });
  });
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});

router.delete("/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;