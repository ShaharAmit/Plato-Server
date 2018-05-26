import * as firebase from '../lib/firebase.js'
const fb = new firebase();
exports.handler = async (change, context) => {
    try {
        const before = change.before.data(),
            after = change.after.data();
        if(before && after) {
            const rest = context.params.rest,
                restID = context.params.restID,
                rawMaterial = context.params.rawMaterial,
                bAmn = before.value.amount,
                aAmn = after.value.amount,
                redLine = after.value.redLine;            
            fb.db.collection(rest+'/'+restID+'/WarehouseStock/'+rawMaterial+'/Meals').get().then((docs) =>{
                //the amount went down
                if(bAmn < aAmn) {
                    const batch = fb.db.batch();
                    docs.forEach(doc => {
                        const docVals = doc.data();
                        const docID = doc.id;
                        //meal not in menu and amount is bigger then redLine
                        if(!docVals.menu && parseFloat(docVals.redLine)  < aAmn) {
                            console.log('update back');
                            batch.update(fb.db.doc(rest+'/'+restID+'/Meals/'+docID),{missing: {[rawMaterial]: firebase.firestore.FieldValue.delete()}});
                            batch.update(fb.db.doc(rest+'/'+restID+'/WarehouseStock/'+rawMaterial+'/Meals/'+docID),{menu : true});
                        }
                    });
                    return batch.commit().then(() => {console.log('meals back to menu')}).catch(err => console.log(err));
                //amount went down and smaller or equal to redLine
                } else if(bAmn > aAmn && aAmn <= parseFloat(redLine)) {
                    const batch = fb.db.batch();
                    docs.forEach(doc => {
                        const docVals = doc.data();
                        const docID = doc.id;
                        if(parseFloat(docVals.redLine) >= aAmn && docVals.importance && docVals.menu) {
                            batch.set(fb.db.doc(rest+'/'+restID+'/Meals/'+docID),{
                                missing: {[rawMaterial]: true},
                                displayed: false
                            },{ merge: true });
                            batch.update(fb.db.doc(rest+'/'+restID+'/WarehouseStock/'+rawMaterial+'/Meals/'+docID),{menu : false});
                        } else if (parseFloat(docVals.redLine) >= aAmn && docVals.menu) {
                            batch.set(fb.db.doc(rest+'/'+restID+'/Meals/'+docID),{missing: {[rawMaterial]: true}},{ merge: true });
                            batch.update(fb.db.doc(rest+'/'+restID+'/WarehouseStock/'+rawMaterial+'/Meals/'+docID),{menu : false});
                        }
                    });
                    return batch.commit().then(() => {console.log('meals removed from menu')}).catch(err => console.log(err));
                } else {
                    console.log('no change');
                    return 0;
                }
            }).catch(err=>{console.error("error: ",err)});
        }            
    } catch(err) {
        console.error("error: ",err);
    }
 }