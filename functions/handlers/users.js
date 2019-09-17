const { db } = require('../util/admin')
const firebaseConfig = require('../util/config')
const firebase = require('firebase');
const { validateSignUpData, validateLoginData } = require('../util/validator')

firebase.initializeApp(firebaseConfig);

// Registers new user
exports.signUp = (request, response) => {
    let newUser = {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle,
        createdAt: new Date().toISOString()
    }

    const { valid, errors } = validateSignUpData(newUser);
    if (!valid) return response.status(400).json({ errors });
    const noImg = 'no-user.png'

    let userToken, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return response.status(400).json({ errors: { handle: `This user is already taken` } })
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(token => {
            userToken = token;
            let userData = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
                userId
            }
            return db.doc(`/users/${newUser.handle}`).set(userData);
        })
        .then(() => {
            return response.status(201).json({ userToken })
        })
        .catch(err => {
            if (err.code === 'auth/email-already-in-use') {
                return response.status(400).json({ errors: { email: 'Email is already in use' } })
            }
            else if (err.code === 'auth/invalid-email') {
                return response.status(400).json({ errors: { email: 'The email address is badly formatted.' } })
            }
            else if (err.code === 'auth/weak-password') {
                return response.status(400).json({ errors: { password: 'Password should be at least 6 characters' } })
            }
            else if (err.code === 'auth/weak-password') {
                return response.status(400).json({ errors: { handle: 'User id is already taken' } })
            }
            else {
                console.error(err);
                return response.status(500).json({ err: err.code })
            }

        })
}


// Sign in user
exports.login = (request, response) => {

    let user = {
        email: request.body.email,
        password: request.body.password,
    }

    const { valid, errors } = validateLoginData(user);
    if (!valid) return response.status(400).json({ errors })

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return response.json({ token })
        })
        .catch(err => {
            if (err.code === 'auth/wrong-password') {
                return response.status(403).json({ errors: { password: 'Incorrect password' } })
            } else if (err.code === 'auth/user-not-found') {
                return response.status(403).json({ errors: { email: 'User not found' } })
            } else if (err.code === 'auth/invalid-email') {
                return response.status(400).json({ errors: { email: 'Please provide valid email' } })
            } else {
                console.error(err);
                return response.status(500).json({ err: err.code })
            }
        })

}


// Check for authentication
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData.credentials = doc.data();
                return userData;
            } else {
                return { error: 'No user data found' };
            }
        })
        .then((data) => {
            return res.json(data);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};