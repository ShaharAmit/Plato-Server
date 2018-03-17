
const testFunction = require('./test');
import * as firebase from '../lib/firebase.js'

var fb = new firebase();

exports.testFunction = fb.functions.https.onRequest((req, res) => {
    testFunction.handler(req, res);
});

