var admin = require('firebase-admin');
var serviceAccount = require('./config.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://plato-7fb01.firebaseio.com'
});
var FirebaseInit = /** @class */ (function () {
    function FirebaseInit() {
        this.db = admin.firestore();
    }
    return FirebaseInit;
}());
module.exports = FirebaseInit;
