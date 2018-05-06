import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();
const auth = admin.auth();
class FirebaseInitialize {
    db;
    admin;
    functions;
    messaging;
    auth;
    constructor() {
        this.functions = functions;
        this.admin = admin;
        this.db = db;
        this.messaging = messaging;
        this.auth = auth;
    }
}
module.exports = FirebaseInitialize;


