const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const authRoute = require('./routes/auth.route');
const usersRoute = require('./routes/users.route');
const postsRoute = require('./routes/posts.route');

dotenv.config();

app.use('/images', express.static(path.join(__dirname, 'public/images')));

// middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

// routes
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/posts', postsRoute);

// connect mongodb
const { DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env;
const MONGODB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.t1hfq.mongodb.net/${DB_DATABASE}?retryWrites=true&w=majority`;

mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
        // start server
        app.listen(process.env.PORT || 8000, () => {
            console.log('Server is running!');
        });
    })
    .catch((error) => {
        console.log(error);
    });
