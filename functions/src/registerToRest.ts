import * as firebase from '../lib/firebase.js'
const fb = new firebase();

exports.handler = async function(req, res) {
    const rest = req.query.rest;
    const token = req.query.token;
    const restRoot = 'RestAlfa';
    const message = await fb.getCol(restRoot+'/'+rest+'/Messages');
    message.forEach(element => {
        fb.messaging.subscribeToTopic([token],element.id).then(function() {
            res.send({success: true});
        });
    });    
 }

 