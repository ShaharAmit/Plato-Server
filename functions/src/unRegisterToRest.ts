import * as firebase from '../lib/firebase.js'
const fb = new firebase();

exports.handler = async (change, context) => {
    const rest = context.params.rest,
        uid = context.params.uid;

    return fb.messaging.unsubscribeFromTopic(uid,rest).then(response => {
        console.log('Successfully unsubscribed from topic:', response);
    }).catch(err => {
        console.error(err);
    });
 }

 