const db = require('../models');

const {filters, parseRSS } = require('../providers/feed')


const create = async (req, res) => {
  try {
    var currentUser = await db.User.findById({ _id: req.body.userId })
  } catch(error) {
    if (error) res.status(500).json({error: error.message})
  }
  

  const feedData = await parseRSS(req.body.feedUrl)

  db.Feed.create({
    feedUrl: feedData.feedUrl,
    sourceUrl: feedData.link,
    imageUrl: feedData.imageUrl,
    title: feedData.title,
    description: feedData.description,
    filterStrength: 0,
    chartData: feedData.chartData
    
  }, (err, savedFeed) => {
    if (err) console.log('Error in feeds#create:', err);
    currentUser.feeds.push(savedFeed)
    currentUser.save(function(err, updatedUser) {
      if (err) res.json({err})
      res.status(201).json({ 
        feed: savedFeed,
        user: updatedUser 
      })
    })
  });
};

const show = async (req, res) => {
  const feedData = await parseRSS(req.body.feedUrl)
  const filterStrength = req.body.filterStrength

  feedData.items = feedData.items.filter(item => filters[filterStrength](item))

  res.status(201).json({data: feedData})
}


module.exports = {
    create,
    show,
};
