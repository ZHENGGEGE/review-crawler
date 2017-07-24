'use strict'

const reviewsCrawler = require('./app.js')

reviewsCrawler('0062472100', function(err, reviews){
	if(err) throw err
	console.log(reviews)
})



