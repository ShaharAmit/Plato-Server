import * as firebase from '../lib/firebase.js'
import { basename } from 'path';
const fb = new firebase();
exports.handler = async function(change, context) {
    try {
        const before = change.before.data();
        const after = change.after.data();
        if(before && after) {
            const restID = context.params.restID;
            const rawMaterial = context.params.rawMaterial
            const docs = await fb.getCol('shahar/'+restID+'/WarehouseStock/'+rawMaterial+'/Meals');
            const bAmn = before.amount;
            const aAmn = after.amount;
            const redLine = after.redLine;

            if(bAmn < aAmn) {
                docs.forEach(doc => {
                    const docVals = doc.data();
                    const docID = doc.id;
                    if(!docVals.menu && docVals.importance && docVals.redLine < redLine) {
                        // Update the population of 'SF'
                        // const ref = fb.db.doc("SF");
                        // batch.update(sfRef, {"population": 1000000});
                    }
                });
            } else if(bAmn > aAmn) {
                docs.forEach(doc => {
                    const docVals = doc.data();
                    const docID = doc.id;
                });
            }
        }
    } catch(err) {

    }
    
    return 0;
 }