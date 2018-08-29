import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {
    const batch = fb.db.batch();

    const connectedTo = {};
    connectedTo['table' + data.movedTableId] = true;

    batch.set(fb.db.doc(`/${fb.rest}/${data.restId}/Tables/${data.connectedToTableId}`), {connectedTo}, {merge: true});
    batch.update(fb.db.doc(`/${fb.rest}/${data.restId}/Tables/${data.connectedToTableId}`), {connectedNow: true});
    batch.update(fb.db.doc(`/${fb.rest}/${data.restId}/Tables/${data.movedTableId}`), {displayed: false});

    return batch.commit();
};
