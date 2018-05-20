import * as firebase from '../lib/firebase.js'
const fb = new firebase();
exports.handler = async (change, context) =>{
    const restID = context.params.restID;
    const data = change.data();
    return fb.messaging.sendToTopic(restID, { 
        notification: {
        title: data.title,
        body: data.body,
        click_action: data.url,
        icon: data.icon
    }}).then(() =>{
          console.log('succes');
          return 0;
      }).catch(err => {
        console.error(err);
      });
}
