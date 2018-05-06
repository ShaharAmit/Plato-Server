const admin = require('firebase-admin');
const serviceAccount = require('./config.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://plato-7fb01.firebaseio.com'
});

class FirebaseInit {
    db: any;
    constructor() {
        this.db = admin.firestore();
    }
    // read document and returns it values
    // return null if problem occur
}
module.exports = FirebaseInit;


