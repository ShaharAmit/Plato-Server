var admin = require('firebase-admin');
var serviceAccount = require('./config.json');
var Promise = require('es6-promise');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://plato-7fb01.firebaseio.com'
});
var FirebaseInit = /** @class */ (function () {
    function FirebaseInit() {
        this.db = admin.firestore();
    }
    // read document and returns it values
    // return null if problem occur
    FirebaseInit.prototype.getDoc = function (path) {
        try {
            var docRef = this.db.doc(path);
            var val_1;
            docRef.get().then(function (doc) {
                if (doc && doc.exists) {
                    var myData = doc.data();
                    return myData;
                }
                else {
                    val_1 = null;
                }
            });
        }
        catch (err) {
            console.log(err);
            return null;
        }
    };
    FirebaseInit.prototype.getCol = function (path) {
        try {
            var docRef = this.db.collection(path);
            var val_2;
            docRef.get().then(function (docs) {
                if (docs) {
                    return docs;
                }
                else {
                    val_2 = null;
                }
            });
        }
        catch (err) {
            console.log(err);
            return null;
        }
    };
    return FirebaseInit;
}());
module.exports = FirebaseInit;
