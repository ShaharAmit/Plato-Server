import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {

    const rest = data.rest;
    const fbId = data.fbId;

    const restId = rest.id;
    const userRestObj = {};
    userRestObj[restId] = true;

    const batch = fb.db.batch();
    const workingDays = rest.workingDays;
    const subMenus = {list: rest.subMenus};
    delete rest.workingDays;
    delete rest.subMenus;

    console.log("Starting Add Rest Function");

    return new Promise((resolve, reject) => {
        const restDoc = fb.db.collection('RestAlfa').doc(rest.id);
        const subMenusDoc = restDoc.collection('restGlobals').doc('subMenus');
        console.log("Adding sub menus");
        batch.set(subMenusDoc, subMenus);
        batch.set(restDoc, rest);
        for (let i = 0; i < workingDays.length; i++) {
            batch.set(restDoc.collection('WorkingDays').doc(`${i}`), workingDays[i]);
        }

        batch.set(fb.db.collection(`/GlobWorkers/${fbId}/Rest`).doc(restId), userRestObj);

        batch.commit().then(resolve).catch(reject);
    });
};