'use strict'
const reviewsCrawler = require('./app.js')
const mysql = require('mysql')
const fs = require('fs')

let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'suzheng',
  database : 'amazon'
});
connection.connect()

reviewsCrawler('B01NBHRIP3', function(err, reviews){
	if(err) throw err
	
	//reviews = JSON.stringify(reviews)
	//console.log(reviews.title)
	//console.log(reviews.reviews)



	var reviews_title = reviews.title
	var reviews_title = reviews_title.toString()
	var reviews = reviews.reviews
	//console.log(reviews)
	var addSqlParams = []
	let addSql = 'insert into `amazon`.`review` (`author`, `parameter`, `date`, `reviews_id`,`link`,`rating`,`text`,`title`,`reviews_title`) values ( ?,?, ?, ?, ?, ?, ?,?,?)';

	reviews.forEach((val) => {
			for(let key in val){
			let a = val[key]
			let str = a.toString()
			addSqlParams.push(str)         
		}
		addSqlParams.push(reviews_title)
		console.log(addSqlParams)
		connection.query(addSql,addSqlParams,function (err, result) {
            if(err){
             console.log('[INSERT ERROR] - ',err.message)
             return;
            }         
    })
    addSqlParams = []
	})
})

