# Amazon Reviews Crawler

Crawls product reviews from Amazon.

## Installation

Via [npm](https://www.npmjs.com/):

```
npm install amazon-reviews-crawler
```

## Usage

### Load the module

```
var reviewsCrawler = require('amazon-reviews-crawler')
```

### Get reviews by a product ASIN

```
reviewsCrawler('0062472100', function(err, reviews){
	if(err) throw err
	console.log(reviews)
})
```

This will return an object containing the title of the product and an array of review data.

Example of a return:

```
{
	title: "Product Name",
	reviews: [
		{
			id: "R16DIYH5RRPEWK",
			title: "Review Title",
			rating: 5,
			text: "The product review body text.",
			author: "Reviewer Name"
			date: "October 26, 2016",
			link: "https://www.amazon.com/gp/customer-reviews/R16DIYH5RRPEWK/ref=cm_cr_arp_d_rvw_ttl?ie=UTF8&ASIN=0062472100"
		}
	]
}
```

## Options

Options can also be provided to change the user agent string, review page, or elements being crawled.

Example:

```
reviewsCrawler('0062472100', {
	page: 'https://www.amazon.com/product-reviews/{{asin}}',
	userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0',
	elements: {
	
		// Searches whole page
		productTitle: '.product-title',
		reviewBlock: '.review',
		
		// Searches within elements.reviewBlock
		link: 'a',
		title: '.review-title',
		rating: '.review-rating',
		ratingPattern: 'a-star-',
		text: '.review-text',
		author: '.review-byline a',
		date: '.review-date'
	},
	
	// Stops crawling when it hits a particular review ID
	// Useful for only crawling new reviews
	stopAtReviewId: false
}
```