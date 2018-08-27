import * as firebase from '../lib/firebase.js'

const fb = new firebase();

exports.handler = async (data, context) => {

    return fb.db.doc(`/RestAlfa/${data.restId}/KitchenStation/${data.kitchenStationId}`).delete();
}