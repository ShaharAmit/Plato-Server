import * as functions from '../node_modules/firebase-functions/lib/index';
import * as admin from '../node_modules/firebase-admin/lib/index'
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

class FirebaseInitialize {
    db: any;
    admin: any;
    functions: any;
    constructor() {
        this.functions = functions;
        this.admin = admin;
        this.db = db;
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
module.exports = FirebaseInitialize;


