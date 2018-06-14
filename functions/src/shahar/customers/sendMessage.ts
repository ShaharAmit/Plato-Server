import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();
exports.handler = async (change, context) =>{
    const restID = context.params.restID,
        data = change.data(),
        message = {
            webpush: {
                notification: {
                    title: data.title,
                    body: data.body,
                    clickAction: data.clickAction,
                    icon: data.icon
                }
            },topic: restID
        };
    console.log(data);
    return fb.messaging.send(message).then(response => {
        console.log('Successfully sent message:', response);
    }).catch(err => {
        console.error(err);
    });
}
