require('dotenv').config();

const express = require('express');
const routes = require('./routes');
const cors = require('cors')

const port = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors())

app.use('/api/v1/feeds', routes.feeds);
app.use("/api/v1/auth", routes.auth);

app.listen(port, () => console.log(`Server is running on port ${port}`));

module.exports = app