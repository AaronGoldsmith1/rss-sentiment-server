const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedSchema = new Schema({
    feedUrl: String,
    sourceUrl: String,
    imageUrl: String,
    title: String,
    description: String,
    filterStrength: Number,
    chartData: {
      title: String,
      veryNegative: Number,
      slightlyNegative: Number,
      neutral: Number,
      slightlyPositive: Number, 
      veryPositive: Number
    }
});

const Feed = mongoose.model('Feed', FeedSchema);

module.exports = Feed;
