import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const batch = fb.db.batch();

    return new Promise((resolve, reject) => {
        batch.commit().then(resolve).catch(reject);
    });
};