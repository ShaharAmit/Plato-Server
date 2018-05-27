import * as firebase from '../lib/firebase.js'
const fb = new firebase();

exports.handler = async (change, context) => {
    const rest = context.params.rest,
        uid = context.params.uid;
        
    return fb.messaging.subscribeToTopic(uid,rest).then(response => {
        console.log('Successfully subscribed to topic:', response);
    }).catch(err => {
        console.log('Error subscribing to topic:', err);
    });
 }

 