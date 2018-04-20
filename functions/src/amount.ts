import * as firebase from '../lib/firebase.js'
const fb = new firebase();
exports.handler = async function(change, context) {
    try {
        const before = change.before.data();
        const after = change.after.data();
        if(before && after) {
            const rest = context.params.rest;
            const restID = context.params.restID;
            const rawMaterial = context.params.rawMaterial
            const bAmn = before.value.amount;
            const aAmn = after.value.amount;
            const redLine = after.value.redLine;
            fb.db.collection(rest+'/'+restID+'/WarehouseStock/'+rawMaterial+'/Meals').get().then(function (docs) {
                if(bAmn < aAmn) {
                    const batch = fb.db.batch();
                    docs.forEach(doc => {
                        const docVals = doc.data();
                        const docID = doc.id;
                        if(!docVals.menu && parseFloat(docVals.redLine)  < aAmn) {
                            batch.update(fb.db.doc(rest+'/'+restID+'/Meals/'+docID),{displayed : true});
                            batch.update(fb.db.doc(rest+'/'+restID+'/WarehouseStock/'+rawMaterial+'/Meals/'+docID),{menu : true});
                        }
                    });
                    return batch.commit().then(function(){console.log('meals back to menu')}).catch(err => console.log(err));
                } else if(bAmn > aAmn && aAmn < parseFloat(redLine)) {
                    const batch = fb.db.batch();
                    docs.forEach(doc => {
                        const docVals = doc.data();
                        const docID = doc.id;
                        if(parseFloat(docVals.redLine) > aAmn && docVals.importance && docVals.menu) {
                            batch.update(fb.db.doc(rest+'/'+restID+'/Meals/'+docID),{displayed : false});
                            batch.update(fb.db.doc(rest+'/'+restID+'/WarehouseStock/'+rawMaterial+'/Meals/'+docID),{menu : false});
                        }
                    });
                    return batch.commit().then(function(){console.log('meals removed from menu')}).catch(err => console.log(err));
                } else {
                    return 0;
                }
            }).catch(err=>{console.error(err)});
        }            
    } catch(err) {
        console.error(err);
    }
 }