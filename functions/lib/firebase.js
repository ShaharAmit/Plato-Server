"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const BigQuery = require('@google-cloud/bigquery'), sinon = require('sinon');
admin.initializeApp();
const db = admin.firestore(), messaging = admin.messaging(), auth = admin.auth(), adminInitStub = sinon.stub(admin, 'initializeApp');
class FirebaseInitialize {
    constructor() {
        this.functions = functions;
        this.admin = admin;
        this.db = db;
        this.messaging = messaging;
        this.auth = auth;
        this.bq = new BigQuery({
            projectId: 'plato-9a79e',
        });
    }
}
module.exports = FirebaseInitialize;
//# sourceMappingURL=firebase.js.map