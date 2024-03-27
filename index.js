const express = require('express');
const urlRoutes = require('./routes/url');
const { connectToMongo } = require('./connections/connect');
const URL = require('./models/url');
const path = require('path');
const staticRoutes = require('./routes/staticRouter');
const userRoutes = require('./routes/user');
const cookieParser = require('cookie-parser');
const { restrictToLoggedinUserOnly, checkAuth } = require('./middlewares/auth');



const app = express();
const PORT = 8001;
const mongoUrl = 'mongodb+srv://nayan2002:nayan2002@cluster2.i9xe0pd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2';
connectToMongo(mongoUrl).then(() => console.log("Mongodb connected !")).catch(err => console.log(err));

// that will parse incoming body request from clients 
// if we send json inside body, then this middleware is used to parse it 
app.use(express.json());
// to parse form data, we use urlEncoded 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// either we can send the whole html here only, but this will be very bulky
// so we use a templating engine that perform server side rendering 
app.set('view engine', 'ejs'); // setting the ejs 
app.set('views', path.resolve('./views')); // giving the path of ejs files 


// if we want to work on /url, then we require to be logged in always 
// this is an inline middleware, that will be executed for this list of urls only 
app.use('/url', restrictToLoggedinUserOnly, urlRoutes);
app.use('/', checkAuth, staticRoutes);
app.use('/user', userRoutes);


// with the help of shortid, i want to go to that original website 
app.get('/url/:shortId', async (req, res) => {
    // using that id, fetch the redirect url from database 
    const shortid = req.params.shortId;
    // find and update because whenever i will find id i need to increase the clicks by adding the time 
    const entry = await URL.findOneAndUpdate({
        shortid, 
    }, { $push : {
        visitHistory: {
            timestamp: Date.now(),
        }
    },});
    res.redirect(entry.redirectURL);
})


app.listen(PORT, () => console.log(`server has started at : ${PORT}`));