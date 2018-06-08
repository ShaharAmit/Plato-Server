import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    console.log('restId: ', data.restId);
    fb.db.collection('Rests' + '/' + data.restId + '/Grocery/').doc(data.name).delete();
    console.log('grocery deleted')
};