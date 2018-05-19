import * as firebase from '../lib/firebase.js'
const fb = new firebase();

exports.handler = async (req, res) => {
    fb.db.collection('shahar').doc().create({
        hello: 'test'
    }).then(() => {
        res.send({success: true});
    }).catch(err => {
        res.send({success: false});
    })
 }

 