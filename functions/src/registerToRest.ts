import * as firebase from '../lib/firebase.js'
const fb = new firebase();

exports.handler = async (change, context) => {
    const rest = context.params.rest,
        uid = context.params.uid;
        
    fb.messaging.subscribeToTopic(uid,rest).then(() => {
        return 0;
    });
 }

 