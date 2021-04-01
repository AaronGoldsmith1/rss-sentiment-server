const db = require('../models');


const create = (req, res) => {

  const feedData = {
    feedUrl: 'http://feeds.bbci.co.uk/news/world/rss.xml',
      sourceUrl: 'https://www.bbc.co.uk/news/',
      imageUrl: 'https://news.bbcimg.co.uk/nol/shared/img/bbc_news_120x60.gif',
      title: 'BBC News - World',
      description: 'BBC News - World',
      filterStrength: 0,
      chartData: {
        title: 'BBC News - World',
        veryNegative: 25,
        slightlyNegative: 25,
        neutral: 25,
        slightlyPositive: 25,
        veryPositive: 0
      }
    }
    
  db.Feed.create(feedData, (err, savedFeed) => {
    if (err) console.log('Error in games#create:', err);

    res.status(201).json({ feed: savedFeed })
    });
};


module.exports = {
    create
};
