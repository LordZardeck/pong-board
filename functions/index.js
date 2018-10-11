const functions = require('firebase-functions');
const crypto = require('crypto');

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

function generateNewInviteCode() {
    const inviteCode = crypto.randomBytes(3).toString('hex');

    return admin.firestore().doc(`/invites/${inviteCode}`).get().then(inviteSnapshot => {
        // Duplicate code, attempt to generate again
        if (inviteSnapshot.exists) {
            return generateNewInviteCode();
        }

        return inviteCode;
    });
}

function getTeamPlayer(teamId, userId) {
    return admin.firestore().doc(`/teams/${teamId}/players/${userId}`).get();
}

function createInviteRecord(inviteCode, teamId, reusable) {
    return admin.firestore().collection('invites')
        .doc(inviteCode)
        .set({
            claimed: false,
            reusable,
            teamId
        });
}

function validateInviteClaim(inviteSnapshot) {
    if (!inviteSnapshot.exists) {
        throw new functions.https.HttpsError('failed-precondition', 'No such invite exists');
    }

    const {claimed, reusable} = inviteSnapshot.data();

    if (claimed && !reusable) {
        throw new functions.https.HttpsError('failed-precondition', 'Invite already claimed');
    }
}

function addPlayerToTeam(invite, userId, firstName, lastName, email) {
    return admin.firestore()
        .doc(`/teams/${invite.teamId}/players/${userId}`)
        .set({
            firstName,
            lastName,
            avatar: `https://www.gravatar.com/avatar/${crypto.createHash('md5').update(email).digest('hex')}?s=200`,
            wins: 0,
            losses: 0,
            rank: 0,
            score: 1000,
            consecutiveWins: 0,
            consecutiveLosses: 0
        })
}

function registerTeamToUser(userId, teamId) {
    return admin.firestore()
        .doc(`/users/${userId}`)
        .collection('teams')
        .add({teamId});
}

function updateInvite(snapshot, doc) {
    if (snapshot.data().reusable) {
        return snapshot;
    }

    return doc.set({claimed: true}, {merge: true});
}

exports.generateInvite = functions.https.onCall((data, context) => {
    const {teamId, reusable} = data;

    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('failed-precondition', 'User must be authenticated to generate invite');
    }

    if (!teamId) {
        throw new functions.https.HttpsError('failed-precondition', 'Must specify a team to generate an invite for.');
    }

    return getTeamPlayer(teamId, context.auth.uid)
        .then(playerSnapshot => {
            if (!playerSnapshot.exists) {
                throw new functions.https.HttpsError('failed-precondition', 'Cannot create invite for a team you are not a part of.');
            }
        })
        .then(() => generateNewInviteCode())
        .then(inviteCode => createInviteRecord(inviteCode, teamId, reusable).then(() => inviteCode));
});

exports.claimInvite = functions.https.onCall((data, context) => {
    const {inviteCode, firstName, lastName, email} = data;

    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('failed-precondition', 'User must be authenticated to claim invite');
    }

    if (!inviteCode) {
        throw new functions.https.HttpsError('failed-precondition', 'No invite code provided to claim');
    }

    const inviteDoc = admin.firestore().collection('invites').doc(inviteCode);

    return inviteDoc.get()
        .then(inviteSnapshot => validateInviteClaim(inviteSnapshot).then(() => inviteSnapshot))
        // Create a new player document for the team
        .then(inviteSnapshot =>
            addPlayerToTeam(
                inviteSnapshot.data(),
                context.auth.uid,
                firstName,
                lastName,
                email || context.auth.email
            )
                .then(() => inviteSnapshot)
        )
        // Register the team on the user account
        .then(
            inviteSnapshot =>
                registerTeamToUser(context.auth.uid, inviteSnapshot.data().teamId)
                    .then(() => inviteSnapshot)
        )
        // Consume the invite
        .then(inviteSnapshot => updateInvite(inviteSnapshot, inviteDoc).then(() => inviteSnapshot));
});

exports.createTeam = functions.https.onCall((data, context) => {
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('failed-precondition', 'User must be authenticated to create a team');
    }

    const {teamName} = data;

    if (!teamName) {
        throw new functions.https.HttpsError('failed-precondition', 'No team name provided');
    }

    return admin.firestore()
        .collection('teams')
        .add({teamName})
        .then(
            teamDoc => teamDoc.collection('players')
                .doc(context.auth.uid)
                .set({}, {merge: true})
                .then(() => teamDoc)
        )
        .then(teamDoc => registerTeamToUser(context.auth.uid, teamDoc.id).then(() => teamDoc))
        .then(teamDoc => teamDoc.get().then(teamSnapshot => ({...teamSnapshot.data(), id: teamSnapshot.id})));
});
