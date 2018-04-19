import * as firebase from '../lib/firebase.js'
import { basename } from 'path';
const fb = new firebase();
exports.handler = async function(change, context) {
    try {
        const before = change.before.data();
        const after = change.after.data();
        if(before && after) {
            const rest = context.params.rest;
            const restID = context.params.restID;
            const rawMaterial = context.params.rawMaterial
            const docs = await fb.getCol(rest+'/'+restID+'/WarehouseStock/'+rawMaterial+'/Meals');
            const bAmn = before.value.amount;
            const aAmn = after.value.amount;
            const redLine = after.value.redLine;

            if(bAmn < aAmn) {
                docs.forEach(doc => {
                    const docVals = doc.data();
                    const docID = doc.id;
                    if(!docVals.menu && parseFloat(docVals.redLine)  < aAmn) {
                        const batch = fb.db.batch();
                        batch.update(fb.db.doc(rest+'/'+restID+'/Meals/'+docID),{displayed : true});
                        batch.update(fb.db.doc(rest+'/'+restID+'/WarehouseStock/'+rawMaterial+'/Meals/'+docID),{menu : true});
                        batch.commit().then(function(){console.log(docID + '  back displayed')});
                    }
                });
            } else if(bAmn > aAmn && aAmn < parseFloat(redLine)) {
                docs.forEach(doc => {
                    const docVals = doc.data();
                    const docID = doc.id;
                    if(parseFloat(docVals.redLine) > aAmn && docVals.importance && docVals.menu) {
                        const batch = fb.db.batch();
                        batch.update(fb.db.doc(rest+'/'+restID+'/Meals/'+docID),{displayed : false});
                        batch.update(fb.db.doc(rest+'/'+restID+'/WarehouseStock/'+rawMaterial+'/Meals/'+docID),{menu : false});
                        batch.commit().then(function(){console.log(docID + ' is no longer displayed')});
                    }
                });
            }
        }
    } catch(err) {
        console.error(err);
    }
    
    return 0;
 }