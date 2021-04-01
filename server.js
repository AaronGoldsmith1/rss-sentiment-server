// imports
require('dotenv').config();
const express = require('express');
const routes = require('./routes');

const port = process.env.PORT || 4000;
const app = express();

// middleware - JSON parsing
app.use(express.json());

// middleware - API routes
app.use('/api/v1/feeds', routes.feeds);
// app.use('/api/v1/users', routes.users);
app.use("/api/v1/auth", routes.auth);

// connection
app.listen(port, () => console.log(`Server is running on port ${port}`));
