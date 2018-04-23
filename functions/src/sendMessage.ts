
import * as firebase from '../lib/firebase.js'
const fb = new firebase();
exports.handler = async function(change, context) {
    const receiverID = context.params.receiverID;
    const data = change.data();
    fb.messaging.sendToTopic(receiverID, 
    {notification: {
        title: data.message.title,
        body: data.message.body,
        click_action: data.message.url,
        icon: "https://firebasestorage.googleapis.com/v0/b/plato-9a79e.appspot.com/o/logo.png?alt=media&token=1c6777fa-4aed-45ce-a31e-fb66af8aa125"
      }}).then(function(){
          console.log('succes');
          return 0;
      }).catch(err => {
        console.error(err);
      });
}
