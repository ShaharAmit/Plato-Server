import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {

    const restId = data.restId;
    const workingDays = data.rest.workingDays;
    const subMenus = data.subMenus;
    delete data.rest.workingDays;

    const batch = fb.db.batch();
    batch.update(fb.db.doc(`/${fb.rest}/${restId}`), data.rest);
    batch.update(fb.db.doc(`/${fb.rest}/${restId}/restGlobals/subMenus`), { list: subMenus });
    for (let i = 0; i < workingDays.length; i++) {
        batch.update(fb.db.doc(`/${fb.rest}/${restId}/WorkingDays/${i}`), workingDays[i]);
    }
    batch.update(fb.db.collection(`${fb.rest}/${restId}/restGlobals`).doc('rankingAlerts'), data.ranking);

    return batch.commit();
}