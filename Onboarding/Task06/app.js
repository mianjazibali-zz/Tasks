/*
let Sequelize = require('sequelize');

let connection = new Sequelize('test', 'root', '', {
    host: 'localhost',
    port: 8080,
    dialect: 'mysql'
});


var Article = connection.define('article', {
    title: Sequelize.STRING,
    body: Sequelize.TEXT
});


connection.sync();
*/

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  port: 8080,
  user: "root",
  password: "",
  database: "test"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});