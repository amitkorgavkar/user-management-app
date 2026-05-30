const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
require("dotenv").config();

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// database connection
const connection = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

// generate a random fake user
let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// Home Route — shows total user count
app.get("/", (req, res) => {
  let q = `SELECT COUNT(*) AS total FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0].total;
      res.render("Home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  }
});

// All users route
app.get("/users", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("show.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  }
});

// Edit route — show edit form for a specific user
app.get("/users/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = ?`;
  try {
    connection.query(q, [id], (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  }
});

// Update Route — verify password then update username
app.patch("/users/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id = ?`;
  try {
    connection.query(q, [id], (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("Wrong password");
      } else {
        let q2 = `UPDATE user SET username = ? WHERE id = ?`;
        connection.query(q2, [newUsername, id], (err, result) => {
          if (err) throw err;
          res.redirect("/users");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  }
});

// Add new random user (for testing/demo purposes)
app.post("/users", (req, res) => {
  let randomUser = getRandomUser();
  let q = `INSERT INTO user (id, username, email, password) VALUES (?)`;
  try {
    connection.query(q, [randomUser], (err, result) => {
      if (err) throw err;
      res.redirect("/users");
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  }
});

app.listen(8080, () => {
  console.log(`Server is listening on port 8080`);
});
