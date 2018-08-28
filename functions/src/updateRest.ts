import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {

    const restId = data.restId;
    const workingDays = data.rest.workingDays;
    const subMenus = data.subMenus;
    delete data.rest.workingDays;

    const batch = fb.db.batch();
    batch.update(fb.db.doc(`/RestAlfa/${restId}`), data.rest);
    batch.update(fb.db.doc(`/RestAlfa/${restId}/restGlobals/subMenus`), { list: subMenus });
    for (let i = 0; i < workingDays.length; i++) {
        batch.update(fb.db.doc(`/RestAlfa/${restId}/WorkingDays/${i}`), workingDays[i]);
    }
    batch.update(fb.db.collection(`RestAlfa/${restId}/restGlobals`).doc('rankingAlerts'), data.ranking);

    return batch.commit();
}