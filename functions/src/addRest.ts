import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const batch = fb.db.batch();
    const workingDays = data.workingDays;
    const subMenus = {list: data.subMenus};
    delete data.workingDays;
    delete data.subMenus;

    console.log("Starting Add Rest Function");

    return new Promise((resolve, reject) => {
        const restDoc = fb.db.collection('RestAlfa').doc(data.id);
        const subMenusDoc = restDoc.collection('restGlobals').doc('subMenus');
        console.log("Adding sub menus");
        batch.set(subMenusDoc, subMenus);
        batch.set(restDoc, data);
        for (let i = 0; i < workingDays.length; i++) {
            batch.set(restDoc.collection('WorkingDays').doc(`${i}`), workingDays[i]);
        }
        batch.commit().then(resolve).catch(reject);
    });
};