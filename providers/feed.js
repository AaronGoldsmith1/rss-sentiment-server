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

  console.log(feed)

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
 feed.chartData.name = feed.title
 
  // console.log(feed)
  return feed
};

module.exports = {
  parseRSS,
}