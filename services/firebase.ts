const admin = require('firebase-admin');
const serviceAccount = require('./config.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://plato-9a79e.firebaseio.com'
});

class FirebaseInit {
    messaging: any;
    db: any;
    constructor() {
        this.db = admin.firestore();
        this.messaging = admin.messaging();
    }
    // read document and returns it values
    // return null if problem occur

}
module.exports = FirebaseInit;



