const functions = require('firebase-functions');
const app = require('express')();
const { getAllRides, postRide } = require('./handlers/rides')
const { signUp, login, uploadImage, getAuthenticatedUser } = require('./handlers/users')
const FBAuth = require('./util/fbauth')
const cors = require('cors');

app.use(cors());
// Rides route
app.get('/rides', FBAuth, getAllRides)
app.post('/rides', FBAuth, postRide);

//Users route
app.post('/signup', signUp);
app.post('/login', login);
app.get('/user', FBAuth, getAuthenticatedUser);


exports.api = functions.https.onRequest(app);