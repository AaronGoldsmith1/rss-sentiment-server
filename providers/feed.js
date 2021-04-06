const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const Parser = require('rss-parser');
const parser = new Parser({ customFields: {
    item: [
      'media:group', 
      'media:content', 
      'image', 
      'description',
      'author',
      'category',
      'pubDate',
      'contentSnippet'
    ],
  }
});

const filters = {
  0: (item) => item,
  1: (item) => item.score >= -0.25 && item.score <= 1,
  2: (item) => item.score >= 0 && item.score <= 1,
  3: (item) => item.score >= 0.25 && item.score <= 1
}

const calculateChartData = (feed) => {
  let ratings = feed.reduce((acc, val) => {
    if (val.score >= -1 && val.score < -0.25) acc.veryNegative++
    if (val.score >= -0.25 && val.score < 0) acc.slightlyNegative++
    if (val.score === 0) acc.neutral++
    if (val.score > 0 && val.score <= 0.25) acc.slightlyPositive++
    if (val.score > 0.25 && val.score <= 1) acc.veryPositive++
    return acc
  }, {
    veryNegative:0,
    slightlyNegative:0,
    neutral:0,
    slightlyPositive:0,
    veryPositive:0,
  })

  for (let key in ratings) {
    ratings[key] = Math.round((ratings[key] / feed.length) * 100)
  }

  return ratings
}

const parseRSS = async function (url) {
  let feed = await parser.parseURL(url);


  feed.items = feed.items.map((item, idx) => {
    let { comparative } = sentiment.analyze(item.title)
    return {
      title: item.title,
      link: item.link,
      date: item.pubDate,
    //  media: item['media:group'] || item['media:content'] || '',
      description: item.description, 
      score: comparative
    } 
  })

 
  feed.chartData = calculateChartData(feed.items)
  feed.chartData.title = feed.title
  feed.feedUrl = url
  feed.imageUrl = feed.image && feed.image.url || '',
  feed.description = feed.description
  feed.filterStrength = 0
  return feed
};



module.exports = {
  filters,
  parseRSS,
}