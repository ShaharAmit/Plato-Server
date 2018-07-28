import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {

    const restId = data.restId;
    const email = data.email;

    return new Promise((resolve, reject) => {

        fb.db.collection('/GlobWorkers').where('email', '==', email).get()
            .then(x => {
                if (x.docs.length === 0) {
                    reject(fb.functions.https.HttpsError('failed-precondition', 'email is incorrect'));
                    return;
                }

                const userId = x.docs[0].id;

                fb.auth.getUserByEmail(email).then(userRecord => {

                    fb.db.collection(`/GlobWorkers/${userId}/Rest`).get().then(userRests => {
                        if (userRests.docs.length > 1) {
                            fb.db.doc(`/GlobWorkers/${userId}/Rest/${restId}`).delete()
                                .then(resolve).catch(reject);

                            const batch = fb.db.batch();
                            batch.delete(fb.db.doc(`/RestAlfa/${restId}/Workers/${userRecord.uid}`));
                            batch.commit().then(resolve).catch(reject);
                            return;
                        }


                        fb.auth.deleteUser(userRecord.uid).then(x => {

                            const batch = fb.db.batch();
                            batch.delete(fb.db.doc(`/GlobWorkers/${userId}`));
                            batch.delete(fb.db.doc(`/RestAlfa/${restId}/Workers/${userRecord.uid}`));
                            batch.commit().then(resolve).catch(reject);

                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
    });

};