const express = require('express');
const monogoose = require('mongoose');
const {engine} = require('express-handlebars')
const path = require('path');
const passport = require('passport');
const session = require('express-session')


require('dotenv').config();
// Passport config
require('./config/passport')(passport)


const app = express();
app.use(express.json());

// Sessions
app.use(
    session({
        secret: 'keyboardcat',
        resave: false,
        saveUninitialized: false,

    })
)

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.engine('.hbs', engine({ defaultLayout: 'main', extname: '.hbs' }));
//app.set('views', path.join(__dirname, '/views'));
app.set('view engine', '.hbs');


// app.engine('.hbs', engine({ extname: '.hbs' }));
// app.set('view engine', '.hbs');

//Routes
const apiRoutes = require('./routes/api');
app.use('/', apiRoutes)
app.use('/auth', require('./routes/auth'))



//passport middleware
app.use(passport.initialize());
app.use(passport.session());


// global error handling middleware
app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message || SERVER_ERR;
    const data = err.data || null;
    res.status(status).json({
        type: "error",
        message,
        data,
    });
});

async function main(){
    try {
      let db =  await monogoose.connect(process.env.MONGO_URL);

      if(!db){
        console.log('Database conntectd failed')
      }
       console.log('Database connection success');

        app.listen(5000, () => {
            console.log('Server is on: 5000')
        })
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


main();

