import * as firebase from '../lib/firebase.js'

const deletePreCheck = require('./preCheckForDeletingRawMaterial');

const fb = new firebase();

exports.handler = async (data, context) => {
    const batch = fb.db.batch();

    return new Promise((resolve, reject) => {
        deletePreCheck.handler(data, context).then(x => {
            console.log('x', x);
            x.mealsAboutToDelete.forEach(x => batch.delete(fb.db.doc(`/RestAlfa/${data.restId}/Meals/${x}`)));
            batch.delete(fb.db.doc(`/RestAlfa/${data.restId}/WarehouseStock/${data.name}`));

            batch.commit().then(resolve).catch(reject);
        }).catch(reject);
    });
};