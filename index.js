/* IMPORTING PACKAGES INSTALLED AND STORING THEM INTO A VARIABLE */

/* USED FOR DEFINING PATH OF FILES */
const path = require('path');

const express = require('express');
const app = new express();

/* TEMPLATING ENGINE : USED TO MINIMIZE REPETITION OF CODE */
const ejs = require('ejs');

/* MAINLY USED FOR CONNECTING WITH DATABASE */
const mongoose = require('mongoose');

/* ACTS AS A MIDDLEWARE */
/* USUALLY FOR LONG IDENTIFIERS SECOND LETTER IS CAPITAL */
const bodyParser = require('body-parser');

/* DEALS WITH USER SESSION (LOGIN SIGNUP) AND COOKIES */
const expressSession = require('express-session');

/* USE FOR UPLOADING A FILE AND STORING */
const fileUpload = require('express-fileupload');

/* USED FOR DISPLAYING ERRORS */
const flash = require('connect-flash');

/*---- IMPORTING SECTION ENDS HERE ---- */

/* SETTING UP CONNECTIONS AND USING SOME PACKAGES */

/* SETTING UP TEMPLATING ENGINE */

app.set('view engine','ejs');

/* ACQUIRING STATIC FILES IN PUBLIC FOLDER */
app.use(express.static('public'));

app.use(flash());
app.use(fileUpload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/* USER-SESSIONS  */
global.loggedIn = null;
app.use(expressSession({
    secret:'InfiniteInsideMe',
    resave:true,
    saveUninitialized:true
}));
/*-------       END       ----------*/

/* TO CONDITIONALLY DISPLAY LOGIN/SIGNUP FORM  */
/* NOTE:SHOULD BE IMPLEMENTED ONLY AFTER USER-SESSION HAS BEEN COMPLETED */
/* AS BELOW INSTRUCTIONS GET EXECUTED IN MIDDLE OF PROCESS NEXT IS USED TO CALL THE NEXT PROCESS IN QUEUE.NEED TO BE DONE IN ALL MIDDLEWARE!!!*/
global.loggedIn = null;
app.use("*",(req,res,next)=>{
    loggedIn = req.session.userId;
    next();
});

/* CONNECTING TO DATABASE USING MONGODB ATLAS */
mongoose.connect("mongodb+srv://RadhaRaman:000ILoveMyBeloved000.@cluster0.a2kmo0r.mongodb.net/Database",{useNewUrlParser:true});
// mongoose.connect("mongodb://localhost:27017/Database",{useNewUrlParser:true})

/*          --------------ROUTING REQUESTS-------------          */
const homeController = require('./public/controllers/home');
app.get('/',homeController);

/*----------------------        ROUTES RELATED TO RESOURCES     -------------------------- */
const resourceController = require('./public/controllers/resources');
app.get('/resources',resourceController);

const freeController = require("./public/controllers/freeforstudents");
app.get('/resources/freeutilites',freeController);

const bookController = require('./public/controllers/bookResources');
app.get('/resources/books',bookController);

const questionsController = require('./public/controllers/questions');
app.get('/resources/questions',questionsController);

const quizController = require('./public/controllers/quiz');
app.get('/resources/quiz',quizController);

const aboutController = require('./public/controllers/about');
app.get('/about',aboutController);

/* ROUTES RELATED TO COMMUNITY */
const communityController = require('./public/controllers/community');
app.get('/community',communityController);

const communityAuthentication = require('./public/middleware/communityAuthentication');
const communityPostController = require('./public/controllers/communitypost');
app.get('/community/post/club1',communityAuthentication,communityPostController);
app.get('/community/post/club2',communityAuthentication,communityPostController);
app.get('/community/post/club3',communityAuthentication,communityPostController);
app.get('/community/post/club4',communityAuthentication,communityPostController);

const storePostController = require('./public/controllers/storeposts');
app.post('/store/community/post',communityAuthentication,storePostController);
/*-------       END       ----------*/


const contactController = require('./public/controllers/contact');
app.get('/contact',contactController);

const Authentication = require('./public/middleware/Authentication');
const lsController = require('./public/controllers/loginSignup');
app.get('/loginsignup',Authentication,lsController);


/* ROUTES RELATED TO LOGIN AND LOGOUT */
const loginUserController = require('./public/controllers/loginUser');
app.post('/loginsignup/loginUser',Authentication,loginUserController);


const logoutController = require('./public/controllers/logOut');
app.get('/logout',logoutController);
/*-------       END       ----------*/

/* ROUTES RELATED TO REGISTER */
const registrationController = require('./public/controllers/storeUser');
app.post('/loginsignup/userRegistration',Authentication,registrationController);
/*-------       END       ----------*/

/* ROUTES RELATED TO SEARCH */
app.use((req,res)=>res.render('../public/views/pagenotfound',{
    title:'404'
}));
/*-------       END    -------*/

app.get('/favicon.ico',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'../assets/img/Books/favicon.png'));
});

/*      -----------------ROUTES SECTION ENDS HERE---------------        */

let port = process.env.PORT || 8000;
app.listen(port, ()=>{
    console.log('App Ready to Serve');
});