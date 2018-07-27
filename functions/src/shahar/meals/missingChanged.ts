import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();
function writeMessages(missing, rest, restID, mealName,url,icon) {
    const batch = fb.db.batch();
    for(const rawMaterial of missing) {
        const timestamp = Date.now();
        batch.set(fb.db.collection(rest+'/'+restID+'/Messages/').doc('MealFinished'+mealName),{
            title: 'the ' + mealName + ' had been removed from menu',
            body: rawMaterial + ' is missing',
            clickAction:  url,
            icon: icon,
            type: 'meal',
            meal: mealName,
            rawMaterial: rawMaterial,
            alert: 'autoAlert',
            timestamp: timestamp
        });
    }
    return batch.commit().then(() => {console.log('messages added')}).catch(err => console.log(err));
}

async function removeMessages(bMissing, rest, restID, mealName) {
    const batch = fb.db.batch();
    for(const rawMaterial of bMissing) {
        await fb.db.collection(rest+'/'+restID+'/Messages').where("type", "==", 'meal').where("rawMaterial","==",rawMaterial).where('meal','==',mealName)
        .get().then(docs => {
            docs.forEach(doc => {
                batch.delete(doc.ref);
              });
        }).then(() => {
            return batch.commit().then(() => {console.log('messages removed')}).catch(err => console.log(err));
        })
        .catch(err => {
            console.error(err);
        })
    }
    return 0;
}

//adding and deleting messages according to missing raw materials
exports.handler = async (change, context) => {
    try {
        const before = change.before.data(),
        after = change.after.data(),
        rest = context.params.rest,
        restID = context.params.restID,
        mealName = context.params.mealName,
        url = fb.url,
        icon = fb.icon;
        //updated
        if(after) {
            const bMissing = before.missing;
            const aMissing = after.missing;
            if(bMissing) {
                if(aMissing) {
                    let aMissingArr = Object.keys(aMissing);
                    let bMissingArr = Object.keys(bMissing);
                    //checking if old missing array is smaller than new
                    if(aMissingArr.length > bMissingArr.length) {
                        if(!after.displayed && after.displayed !== before.displayed) {
                            aMissingArr = await aMissingArr.filter( ( el ) => !bMissingArr.includes( el ) );
                            const val = await writeMessages(aMissingArr, rest, restID, mealName, url, icon);
                            return val;
                        }
                    } else {
                        bMissingArr = await bMissingArr.filter( ( el ) => !aMissingArr.includes( el ) );
                        const val = await removeMessages(bMissingArr, rest, restID, mealName);
                        return val;
                    }
                }
            } else if (aMissing) {
                const aMissingArr = Object.keys(aMissing);
                if(aMissingArr.length>0) {
                    if(!after.displayed) {
                        //if newley created, check if new missing array is bigger then 0
                        const val = await writeMessages(aMissingArr, rest, restID, mealName, url, icon);
                        return val;
                    }     
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
            //if missing is deleted completley, check if before is exist
        } else if (before) {
            const bMissing = before.missing;
            const bMissingArr = Object.keys(bMissing);
            const val = await removeMessages(bMissingArr, rest, restID, mealName);
            return val;
        }  else {
            return 0;
        }
    } catch(err) {
        console.error(err);
    }
 }