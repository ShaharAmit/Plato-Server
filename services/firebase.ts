const admin = require('firebase-admin');
const serviceAccount = require('./config.json');
var Promise = require('es6-promise') 

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
    getDoc(path) {
        try{
            let docRef = this.db.doc(path);
            let val:any;
            docRef.get().then(function(doc){
                if(doc && doc.exists) {
                    const myData = doc.data();
                    return myData;
                } else {
                    val = null;
                }
            });
        } catch(err) {
            console.log(err);
            return null;
        }
    }
    getCol(path) {
        try{
            const docRef = this.db.collection(path);
            let val:any;
            docRef.get().then(function(docs){
                if(docs) {
                    return docs;
                } else {
                    val = null;
                }
            });
        } catch(err) {
            console.log(err);
            return null;
        }
    }
}
module.exports = FirebaseInit;


