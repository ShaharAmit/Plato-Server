import * as firebase from '../lib/firebase.js'
const fb = new firebase();

exports.handler = async function(req, res) {
    const path = req.query.path;
    const test = await fb.getdoc(path);
    return 0;
 }

 