import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
const BigQuery = require('@google-cloud/bigquery'),
    sinon = require('sinon'),
    http = require('http');

admin.initializeApp();
const db = admin.firestore(),
    messaging = admin.messaging(),
    auth = admin.auth(),
    adminInitStub = sinon.stub(admin, 'initializeApp'),
    FieldValue = admin.firestore.FieldValue;


class FirebaseInitialize {
    bq: any;
    auth: admin.auth.Auth;
    messaging: admin.messaging.Messaging;
    db: FirebaseFirestore.Firestore;
    admin: typeof admin;
    functions: typeof functions;
    googleApiKey: string;
    rest: string
    fieldValue: typeof FirebaseFirestore.FieldValue;
   
    constructor() {
        this.functions = functions;
        this.admin = admin;
        this.db = db;
        this.messaging = messaging;
        this.auth = auth;
        this.bq = new BigQuery({
            projectId: 'plato-9a79e',
        });
        this.googleApiKey = 'AIzaSyAieQ7Jq2rYkjMPgOqTLe9FM4Pcblt1M0k';
        this.rest = 'RestAlfa';
        this.fieldValue = FieldValue;
    } 
}
module.exports = FirebaseInitialize;


