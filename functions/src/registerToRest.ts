import * as firebase from '../lib/firebase.js'
const fb = new firebase();

exports.handler = async function(req, res) {
    const rest = req.query.rest;
    const token = req.query.token;
    fb.messaging.subscribeToTopic([token],rest).then(function() {
        res.send({success: true});
    });
 }

 