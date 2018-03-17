const admin = require('firebase-admin');
const serviceAccount = require('./config.json');
var Promise = require('es6-promise') 

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://plato-test-bc0d5.firebaseio.com'
});

class FirebaseInit {
    db: any;
    constructor() {
        this.db = admin.firestore();
    }

    async getFile(path) {
        try{
            let docRef = this.db.doc(path);
            let val:any;
            await docRef.get().then(function(doc){
                if(doc && doc.exists) {
                    const myData = doc.data();
                    val = myData;
                } else {
                    val = null;
                }
            });
            return val;
        } catch(err) {
            console.log(err);
            return null;
        }
    }
}
module.exports = FirebaseInit;


