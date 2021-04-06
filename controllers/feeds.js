const db = require('../models');
const {filters, parseRSS } = require('../providers/feed')

//show all feeds in db
const index = async (req, res) => {
  try {
    const allFeeds = await db.Feed.find()

    res.status(200).json({ data: allFeeds })

  } catch(error) {
    res.status(500).json({ message: error.message})
  }
}

//store new feed for a user
const create = async (req, res) => {
  try {
    var currentUser = await db.User.findById({ _id: req.body.userId })
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
    currentUser.feeds.unshift(savedFeed)
    currentUser.save( async function(err, user) {
      if (err) res.json({err})
      if (!user) res.status(500).json({error: error.message})
      let updatedUser = await db.User.findById({ _id: user._id}).populate('feeds').exec()
      res.status(201).json({ 
        feed: savedFeed,
        user: updatedUser
      })
    })
  });
  } catch(error) {
    if (error) res.status(500).json({error: error.message})
  }

};

//show individual feed items, filtered by sentiment
const show = async (req, res) => {
  try {
    const currentFeed = await db.Feed.findOne({_id: req.params.id})

    const feedData = await parseRSS(currentFeed.feedUrl)
    const filterStrength = req.params.filterStrength || 0

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

    const updatedUser = await db.User.findById({ _id: req.body.userId}).populate('feeds').exec()

    res.status(200).json({
      success: true,
      message: 'Feed successfully updated',
      data: {
        success: true,
        recordsAffected: updatedFeed.nModified,
        user: updatedUser
      }
    })
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
}

//remove rss feed from users list and db
const destroy = async (req, res) => {
  try {
    const currentUser = await db.User.findById({ _id: req.body.userId})
    
    currentUser.feeds.remove(req.body.feedId)
    
    await currentUser.save()
    
    let updatedUser = await db.User.findById({_id: req.body.userId}).populate('feeds').exec()

    await db.Feed.deleteOne({ _id: req.body.feedId})
    
    res.status(200).json({
      success: true,
      message: `Feed has been deleted`,
      data: {
        feed: req.body.feedId,
        user: updatedUser
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
