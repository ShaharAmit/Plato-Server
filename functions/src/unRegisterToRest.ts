import * as firebase from '../lib/firebase.js'
const fb = new firebase();

exports.handler = async (change, context) => {
    const rest = context.params.rest,
        uid = context.params.uid;

    fb.messaging.unsubscribeFromTopic(uid,rest).then(() => {
        return 0;
    }).catch(err => {
        console.error(err);
        return 0;
    });
 }

 