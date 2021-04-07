const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI || "mongodb://localhost:27017/feedlib";
const configOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};

mongoose.connect(connectionString, configOptions)
    .catch(err => console.log(`MongoDB connection error: ${err}`));

module.exports = {
    Feed: require('./feed'),
    User: require('./user')
};
