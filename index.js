const express = require("express");
const mysql = require("mysql");
const app = express();
const pool = require("./dbPool");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true})); 
//routes
app.get('/', (req, res) => {
   res.render('index')
});
//Display form for input Author information
app.get("/author/new", (req, res) => {
   res.render("newAuthor")
});
app.get("/dbTest", async function(req, res){
let sql = "SELECT CURDATE()";
let rows = await executeSQL(sql);
res.send(rows);
});//dbTest
app.post("/author/new", async function(req, res){
  let fName = req.body.fName;
  let lName = req.body.lName;
  let birthDate = req.body.birthDate;

  //to see the data sent by form
  //console.log(req.body);
  //end 

  let sql = "INSERT INTO q_authors (firstName, lastName, dob) VALUES (?, ?, ? );"
  let params = [fName, lName, birthDate];
  let rows = await executeSQL(sql, params);
  res.render("newAuthor", {"message": "Author added!"});
});

app.get("/authors", async function(req, res){
 let sql = `SELECT *
            FROM q_authors
            ORDER BY lastName`;
 let rows = await executeSQL(sql);
 res.render("authorList", {"authors":rows});
});

app.get("/author/edit", async function(req, res){
 
 let authorId = req.query.authorId;
 
 let sql = `SELECT *, DATE_FORMAT(dob, '%Y-%m-%d') dobISO
            FROM q_authors
            WHERE authorId = ${authorId}`;
 let rows = await executeSQL(sql);
 res.render("editAuthor", {"authorInfo":rows});
});

app.post("/author/edit", async function(req, res){
 let sql = `UPDATE q_authors
            SET firstName = ?,
               lastName = ?,
               dob = ?,
               sex = ?
            WHERE authorId =  ?`;
 
let params = [req.body.fName,  
              req.body.lName, 
              req.body.dob, 
              req.body.sex,
              req.body.authorId];         
let rows = await executeSQL(sql,params);
 
sql = `SELECT *, 
        DATE_FORMAT(dob, '%Y-%m-%d') dobISO
        FROM q_authors
        WHERE authorId= ${req.body.authorId}`;
 rows = await executeSQL(sql);
 res.render("editAuthor", {"authorInfo":rows, "message": "Author Updated!"});
});


app.get("/author/delete", async function(req, res) {
  let sql = `DELETE
             FROM q_authors
             WHERE authorid = ${req.query.authorId}`;
  let rows = await executeSQL(sql);
  res.redirect("/authors");
});

app.get("/quote/new", async (req, res) => {
   let sql = `SELECT firstName, lastName, authorId from q_authors
   ORDER BY lastName`
   let rows = await executeSQL(sql);
   res.render("newQuote", {"authors":rows})
});

app.post("/quote/new", async function(req, res){
  let quote = req.body.quote;
  let authorId = req.body.authorId;
  let category = req.body.category;
  let sql = "INSERT INTO q_quotes (quote, authorId, category) VALUES (?, ?, ? );"
  let params = [quote, authorId, category];
  let rows = await executeSQL(sql, params);
  res.render("newQuote", {"authors":rows},{"message": "Quote added!"});
});

app.get("/quotes", async function(req, res){
 let sql = `SELECT *
            FROM q_quotes`;
 let rows = await executeSQL(sql);
 res.render("quotesList", {"quotes":rows});
});

app.get("/quote/edit", async function(req, res){
 
 let quoteId = req.query.quoteId;
 
 let sql = `SELECT *
            FROM q_quotes
            WHERE quoteId = ${quoteId}`;
 let rows = await executeSQL(sql);
 res.render("editQuote", {"quoteInfo":rows});
});

app.post("/quote/edit", async function(req, res){
 let sql = `UPDATE q_quotes
            SET quote = ?,
               category = ?
            WHERE quoteId =  ?`;
 
let params = [req.body.quote,  
              req.body.category, 
              req.body.quoteId];         
let rows = await executeSQL(sql,params);
 
sql = `SELECT *
        FROM q_quotes
        WHERE quoteId= ${req.body.quoteId}`;
 rows = await executeSQL(sql);
 res.render("editQuote", {"quoteInfo":rows, "message": "Quote Updated!"});
});

app.get("/quote/delete", async function(req, res) {
  let sql = `DELETE
             FROM q_quotes
             WHERE quoteId = ${req.query.quoteId}`;
  let rows = await executeSQL(sql);
  res.redirect("/quotes");
});

//functions
async function executeSQL(sql, params){
return new Promise (function (resolve, reject) {
pool.query(sql, params, function (err, rows, fields) {
if (err) throw err;
   resolve(rows);
});
});
}//executeSQL
 
//start server
app.listen(3000, () => {
console.log("Expresss server running...")
} )