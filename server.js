const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const app = express();
const PORT = process.env.PORT || 8080;
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sess = {
  secret: "Secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};
const hbs = exphbs.create({
  helpers: {
    format_date: (date) => {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    },
  },
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(require("./controllers/"));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
  sequelize.sync({ force: false });
});