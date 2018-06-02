import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (req, res) => {
    const rest = req.query.rest,
        ref = fb.db.collection(rest);
    ref.get().then(docs => {
        
    });
 }  

 