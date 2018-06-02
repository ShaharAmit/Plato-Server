import * as firebase from '../../../lib/firebase.js'
const fb = new firebase(),
    request = require('request');

exports.handler = (req, res) => {
    const ref = fb.db.doc('Counters/rests');
    return ref.get().then(doc => {
        return doc.data().counter;
    }).then(counter => {
        ref.update({
            counter: (counter+1)
        });
    });
 }

 
 
