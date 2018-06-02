import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const batch = fb.db.batch();
    const workingDays = data.workingDays;
    delete data.workingDays;

    return new Promise((resolve, reject) => {
        const restDoc = fb.db.collection('RestAlfa').doc(data.id);
        batch.set(restDoc, data);
        for (let i = 0; i < workingDays.length; i++) {
            batch.set(restDoc.collection('WorkingDays').doc(`${i}`), workingDays[i]);
        }
        batch.commit().then(resolve).catch(reject);
    });
};