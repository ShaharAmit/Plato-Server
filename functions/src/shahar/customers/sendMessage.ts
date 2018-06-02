import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();
exports.handler = async (change, context) =>{
    const restID = context.params.restID;
    const data = change.data();
    return fb.messaging.send({ 
        webPush: {
            notification: {
                title: data.title,
                body: data.body,
                click_action: data.url,
                icon: data.icon
            }
        }, topic: restID
    }).then(response => {
        console.log('Successfully sent message:', response);
    }).catch(err => {
        console.error(err);
    });
}
