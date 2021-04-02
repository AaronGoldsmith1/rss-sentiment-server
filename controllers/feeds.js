const db = require('../models');
const {filters, parseRSS } = require('../providers/feed')

//show all of a user rss feeds
const index = async (req, res) => {
  try {
    const currentUser = await db.User.findById({ _id: req.body.userId}).populate('feeds').exec()

    res.status(200).json({ data: currentUser.feeds })

  } catch(error) {
    res.status(500).json({ message: error.message})
  }
}

//store new feed for a user
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
        user: updatedUser.feeds
      })
    })
  });
};

//show individual feed items, filtered by sentiment
const show = async (req, res) => {
  try{
    const feedData = await parseRSS(req.body.feedUrl)
    const filterStrength = req.body.filterStrength || 0

    feedData.items = feedData.items.filter(item => filters[filterStrength](item))

    res.status(200).json({data: feedData})
  } catch(error) {
    res.status(500).json({
      sucess: false,
      message: error.message
    })
  }
}

//update sentiment filter strength for rss feed
const update = async (req, res) => {
  try {
    const filterStrength = req.body.filterStrength
    const updatedFeed = await db.Feed.updateOne({_id: req.body.feedId}, { filterStrength })
    
    res.status(200).json({
      success: true,
      message: 'Feed successfully updated',
      data: {
        success: true,
        recordsAffected: updatedFeed.nModified
      }
    })
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
}

//remove rss feed from users list and db
const destroy = async (req, res) => {
  try {
    const currentUser = await db.User.findOne({ _id: req.body.userId})
    
    currentUser.feeds.remove(req.body.feedId)
    
    await currentUser.save()
    
    await db.Feed.deleteOne({ _id: req.body.feedId})
    
    res.status(200).json({
      success: true,
      message: `Feed has been deleted`,
      data: {
        feed: req.body.feedId,
        user: currentUser
      }
    })
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  index,
  create,
  show,
  update,
  destroy
};
