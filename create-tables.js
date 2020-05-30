var mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database : process.env.DB_NAME,
	
  insecureAuth : true
  
})

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
})










connection.query(`CREATE TABLE IF NOT EXISTS followers (id bigint(20) NOT NULL, user_id bigint(20) NOT NULL, follower_id bigint(20) NOT NULL); `, function (error,results, fields) { if (error) throw error;  
});

connection.query(`CREATE TABLE IF NOT EXISTS followings ( id bigint(20) NOT NULL, user_id bigint(20) NOT NULL, following_id bigint(20) NOT NULL)`, function (error, results, fields) {
  if (error) throw error;
  
});

connection.query(`CREATE TABLE IF NOT EXISTS post (  id bigint(20) UNSIGNED NOT NULL, author_id bigint(20) NOT NULL, created_at datetime DEFAULT CURRENT_TIMESTAMP,content text COLLATE utf8mb4_general_ci NOT NULL)`, function (error, results, fields) {
  if (error) throw error;
  
});

connection.query(`CREATE TABLE IF NOT EXISTS users ( id int(10) UNSIGNED NOT NULL, name varchar(30) COLLATE utf8mb4_general_ci NOT NULL, email varchar(100) COLLATE utf8mb4_general_ci NOT NULL, pass varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL)`, function (error, results, fields) {
  if (error) throw error;
  
});


connection.query(`ALTER TABLE followers ADD PRIMARY KEY (id)`, function (error, results, fields) {
  if (error) throw error;
  
});


connection.query(`ALTER TABLE followings ADD PRIMARY KEY (id)`, function (error, results, fields) {
  if (error) throw error;
  
});

connection.query(`ALTER TABLE post ADD PRIMARY KEY (id)`, function (error, results, fields) {
  if (error) throw error;
  
});

connection.query(`ALTER TABLE users ADD PRIMARY KEY (id),  ADD UNIQUE KEY id (id)`, function (error, results, fields) {
  if (error) throw error;
  
});

connection.query(`ALTER TABLE followers MODIFY id bigint(20) NOT NULL AUTO_INCREMENT`, function (error, results, fields) {
  if (error) throw error;
  
});

connection.query(`ALTER TABLE followings MODIFY id bigint(20) NOT NULL AUTO_INCREMENT`, function (error, results, fields) {
  if (error) throw error;
  
});

connection.query(`ALTER TABLE post MODIFY id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT`, function (error, results, fields) {
  if (error) throw error;
  
});

connection.query(`ALTER TABLE users MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT`, function (error, results, fields) {
  if (error) throw error;
  
});



console.log("All Table Created Successfuly")








module.exports = connection;
