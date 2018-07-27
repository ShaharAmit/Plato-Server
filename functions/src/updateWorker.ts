import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {

    const restId = data.restId;
    const oldEmail = data.worker.oldEmail;
    const name = data.worker.name;
    const role = data.worker.role;

    return new Promise((resolve, reject) => {
        fb.db.collection('/GlobWorkers').where('email', '==', oldEmail).get()
            .then(x => {
                if (x.docs.length === 0) {
                    reject(fb.functions.https.HttpsError('failed-precondition', 'email is incorrect'));
                    return;
                }

                console.log('user', x.docs[0].id);
                resolve();

            }).catch(reject);
    });

};