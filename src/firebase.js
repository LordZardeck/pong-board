import firebase from 'firebase';

const app = firebase.initializeApp(
    {
        apiKey: 'AIzaSyBBrSKq927rIw9-YuZJntdRdRDwLVmUe1o',
        projectId: 'pongboard-c43c7'
    }
);

export default app;

export const firestore = app.firestore();

firestore.settings({timestampsInSnapshots: true});
