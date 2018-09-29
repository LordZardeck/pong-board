const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addPlayer = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const {firstName, lastName, avatar} = req.query;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.firestore().collection('/players').add({
        firstName,
        lastName,
        avatar,
        wins: 0,
        losses: 0,
        rank: 0,
        score: 1000,
        consecutiveWins: 0,
        consecutiveLosses: 0
    }).then((writeResult) => {
        return res.json({result: `Message with ID: ${writeResult.id} added.`});
    });
});
