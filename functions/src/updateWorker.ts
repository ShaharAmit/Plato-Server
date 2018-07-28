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

                fb.db.doc(`/RestAlfa/${restId}`).get().then(rest => {
                    const newEmail = `${name.split(' ')[0]}.${name.split(' ')[1]}@${rest.data().name.toLowerCase()}.com`;

                    fb.auth.getUserByEmail(oldEmail).then(userRecord => {
                        fb.auth.updateUser(userRecord.uid, {
                            email: newEmail,
                            displayName: name
                        }).then(updatedUser => {
                            const batch = fb.db.batch();
                            batch.update(fb.db.doc(`/GlobWorkers/${x.docs[0].id}`), {
                                email: newEmail,
                                name,
                                role
                            });

                            batch.update(fb.db.doc(`/RestAlfa/${restId}/Workers/${updatedUser.uid}`), {
                                email: newEmail,
                                name,
                                role,
                                uid: updatedUser.uid
                            });

                            batch.commit().then(resolve).catch(reject);

                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
    });

};