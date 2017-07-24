'use strict'
const Horseman = require('node-horseman')
var random_ua = require('random-ua');

const defaultOptions = {
	page: 'https://www.amazon.com/product-reviews/{{asin}}/ref=cm_cr_arp_d_viewopt_srt?reviewerType=all_reviews&pageNumber=1&sortBy=recent',
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
		date: '.review-date',
		parameter:'.review-format-strip'
		
	},
	stopAtReviewId: false
}

function crawlReview(asin, opt, cb) {
	// Find options
	if (typeof opt === 'function') {
		cb = opt
		opt = defaultOptions
	} else if (typeof opt === 'object') {
		let i
		for (i in defaultOptions) {
			if (!(i in opt)) {
				opt[i] = defaultOptions[i]
			}
		}
	}

	const horseman = new Horseman({
		loadImages: false,
		injectJquery: false
	})
	const pageLink = opt.page.replace('{{asin}}', asin)

	// Crawl link
	horseman
		.userAgent(random_ua.generate())
		.open(pageLink)
		.status()
		.then(status => {
			if (Number(status) >= 400) {
				cb(`Page ${pageLink} failed with status: ${status}`)
			}
		})
		.evaluate(function(opt) {
			var reviews = document.querySelectorAll(opt.elements.reviewBlock)
			var title = document.querySelector(opt.elements.productTitle)
			title = title ? title.textContent : 'Not found'
			
			var arr = []


			for (var i = 0; i < reviews.length; i++) {

				// Get review ID from link
				var els = {
					link: reviews[i].querySelector(opt.elements.link),
					title: reviews[i].querySelector(opt.elements.title),
					text: reviews[i].querySelector(opt.elements.text),
					rating: reviews[i].querySelector(opt.elements.rating),
					author: reviews[i].querySelector(opt.elements.author),
					date: reviews[i].querySelector(opt.elements.date),
					parameter:reviews[i].querySelector(opt.elements.parameter)
				}
				if(els.parameter){
					var parameter = els.parameter.textContent.trim()
					console.log(parameter)
				}


				if (els.link) {
					var link = els.link.href
					console.log(link)
					var id = link.split('/')
					id = id[id.length - 2]
				} else {
					cb('No link/ID found in reviews')
				}

				// If this is the most recent, stop crawling page
				if (opt.stopAtReviewId == id) {
					break
				}

				// Trim date
				var date = undefined;
				if (els.date) {
					var date = els.date.textContent.trim()
					if (date.indexOf('on ') === 0) {
						date = new Date(date.replace('on ', ''))
						if (date == 'Invalid Date') {
							date = undefined;
						}
					}
				}

				// Put each in try statement
				arr[i] = {
						id: id,
						link: link,
						title: els.title ? els.title.textContent : 'Not found',
						text: els.text ? els.text.textContent : 'Not found',
						rating: els.rating,
						author: els.author ? els.author.textContent : 'Not found',
						date: date,
						parameter:parameter
						
					}
					// Get rating from class
				if (els.rating) {
					var rat = els.rating.classList
					var found = false
					for (var ii = rat.length; ii--;) {
						if (rat[ii].indexOf(opt.elements.ratingPattern) == 0) {
							found = rat[ii].replace(opt.elements.ratingPattern, '')
							found = Number(found)
						}
					}
					arr[i].rating = found
				} else {
					arr[i].rating = 'Not found'
				}
			}

			return {
				title: title,
				reviews: arr
				
				
			}
		}, opt)
		.then(content => {
			// Callback with review content
			cb(false, content)
		})
		.catch(err => {
			cb(err)
		})
		.close()
}


module.exports = crawlReview