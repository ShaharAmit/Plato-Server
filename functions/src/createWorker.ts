import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {

    const restId = data.restId;
    const worker = data.worker;
    worker.displayName = `${worker.firstName} ${worker.lastName}`;

    console.log('worker', worker);

    return new Promise(((resolve, reject) => {

        fb.db.doc(`/${fb.rest}/${restId}`).get().then(rest => {
            worker.email = `${worker.firstName}.${worker.lastName}@${rest.data().name.toLowerCase()}.com`;

            fb.auth.createUser({
                email: worker.email,
                emailVerified: true,
                password: worker.password,
                disabled: false,
                displayName: worker.displayName
            }).then(userRecord => {
                console.log('created', userRecord);

                fb.db.collection('/GlobWorkers').add({
                    email: worker.email,
                    name: worker.displayName,
                    role: worker.role,
                    id: worker.id,
                    pic: worker.pic
                }).then(x => {

                    const batch = fb.db.batch();
                    const restData = {};
                    restData[restId] = true;
                    batch.set(fb.db.collection(`/GlobWorkers/${x.id}/Rest`).doc(restId), restData);
                    batch.set(fb.db.collection(`/${fb.rest}/${restId}/Workers`).doc(userRecord.uid), {
                        email: worker.email,
                        name: worker.displayName,
                        role: worker.role,
                        id: worker.id,
                        uid: userRecord.uid,
                    });
                    batch.commit().then(resolve).catch(reject);
                }).catch(reject);
            }).catch(reject);
        }).catch(reject);
    }));

};