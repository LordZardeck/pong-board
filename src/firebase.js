import firebase from 'firebase';

const app = firebase.initializeApp(
    {
        apiKey: 'AIzaSyBJh_ReonfLXYE07iFGXofe4FBc1g-ixxo',
        projectId: 'classy-llama-pong'
    }
);

export default app;

export const firestore = app.firestore();

firestore.settings({timestampsInSnapshots: true});
