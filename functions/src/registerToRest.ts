import * as firebase from '../lib/firebase.js'
const fb = new firebase();

exports.handler = async (req, res) => {
    const rest = req.query.rest;
    const token = req.query.token;
    fb.messaging.subscribeToTopic([token],rest).then(() => {
        res.send({success: true});
    });
 }

 