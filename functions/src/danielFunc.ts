import * as firebase from '../lib/firebase.js'
const fb = new firebase();



exports.handler = async function(req, res) {
    const answer = await fb.getDoc('Customers/304861412');
    console.log(answer);
    res.send(answer); 
 }