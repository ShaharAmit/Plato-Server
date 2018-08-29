import * as firebase from '../lib/firebase.js'
import {HttpsError} from "firebase-functions/lib/providers/https";

const fb = new firebase();

function createDish(dishDoc, data, reject, resolve) {
    dishDoc.set(data.dish)
        .then(() => {
            data.groceries.forEach(x => {
                dishDoc.collection('grocery').doc(x).set({id: x})
                    .then(() => {
                        console.log('grocery created');
                        resolve();
                    })
                    .catch(e => {
                        console.log('error creating grocery', e);
                        reject(e);
                    });
            });
        })
        .catch(x => {
            console.log('error creating dish', x);
            reject(x);
        });
}

exports.handler = async (data, context) => {
    console.log('restId: ', data.restId);
    const dishDoc = fb.db.collection(fb.rest + '/' + data.restId + '/Dishes/').doc(data.dish.name);
    return new Promise((resolve, reject) => {

        dishDoc.get().then(x => {
            if (x.exists) {
                console.log('dish exists');
                if (!data.update) {
                    console.log('rejecting2!!!');
                    reject(new HttpsError('already-exists', 'dish already exists'));
                }
                else {
                    console.log('overwriting dish');
                    createDish(dishDoc, data, reject, resolve);
                }
            }
            else {
                console.log('creating new dish');
                createDish(dishDoc, data, reject, resolve);
            }
        });
    });
};