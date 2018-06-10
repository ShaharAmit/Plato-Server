import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
const BigQuery = require('@google-cloud/bigquery'),
    sinon = require('sinon'),
    http = require('http');

admin.initializeApp();
const db = admin.firestore(),
    messaging = admin.messaging(),
    auth = admin.auth(),
    adminInitStub = sinon.stub(admin, 'initializeApp');

class FirebaseInitialize {
    bq: any;
    auth: admin.auth.Auth;
    messaging: admin.messaging.Messaging;
    db: FirebaseFirestore.Firestore;
    admin: typeof admin;
    functions: typeof functions;
    googleApiKey: string;
    rest: string
   
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
    }
    options(path,size,method,port,hostname) {
        const opt = {
            hostname: hostname,
            port: port,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': size
            }
        }
        return opt;
    }

    //http request as promsie
    httpRequest(params, postData) {
        return new Promise((resolve, reject) => {
            const req = http.request(params, (res) => {
                // reject on bad status
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    return reject(new Error('statusCode=' + res.statusCode));
                }
                let serverData='';
                console.log(`\nSTATUS: ${res.statusCode}`);
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    serverData += chunk;
                });
                res.on('end', () => {
                    resolve(serverData);
                });
            });
            // reject on request error
            req.on('error', function(err) {
                reject(err);
            });
            if (postData) {
                req.write(postData);
            }
            req.end();
        }).catch(err => console.log(err));
    }
}
module.exports = FirebaseInitialize;


