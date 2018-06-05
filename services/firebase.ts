const admin = require('firebase-admin'),
    serviceAccount = require('./config.json'),
    BigQuery = require('@google-cloud/bigquery');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://plato-9a79e.firebaseio.com'
});

class FirebaseInit {
    messaging: any;
    db: any;
    bq: any;
    constructor() {
        this.db = admin.firestore();
        this.messaging = admin.messaging();
        this.bq = new BigQuery({
            projectId: 'plato-9a79e',
        });
    }
    // read document and returns it values
    // return null if problem occur

}
module.exports = FirebaseInit;



