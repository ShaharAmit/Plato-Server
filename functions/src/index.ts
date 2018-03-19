
const testFunction = require('./test');
const danielFunc = require('./danielFunc');


import * as firebase from '../lib/firebase.js'

var fb = new firebase();

exports.testFunction = fb.functions.https.onRequest((req, res) => {
    testFunction.handler(req, res);
});

exports.danielFunc = fb.functions.https.onRequest((req, res) => {
    danielFunc.handler(req, res);
});

