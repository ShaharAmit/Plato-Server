import * as firebase from '../lib/firebase.js'
const fb = new firebase();
function writeMessages(missing, rest, restID, mealName,url,icon) {
    const batch = fb.db.batch();
    for(const rawMaterial of missing) {
        batch.set(fb.db.doc(rest+'/'+restID+'/Messages/'+mealName),{
            title: restID,
            body: mealName + ' missing ' + rawMaterial,
            url:  url,
            icon: icon        
        });
    }
    return batch.commit().then(function(){console.log('messages added')}).catch(err => console.log(err));
}

function removeMessages(bMissing, rest, restID, mealName) {
    const batch = fb.db.batch();
    for(const rawMaterial of bMissing) {
        batch.delete(fb.db.doc(rest+'/'+restID+'/Messages/'+mealName));
    }
    return batch.commit().then(function(){console.log('messages removed')}).catch(err => console.log(err));
}

exports.handler = async function(change, context) {
    try {
        const before = change.before.data(),
        after = change.after.data(),
        rest = context.params.rest,
        restID = context.params.restID,
        mealName = context.params.mealName,
        url = 'https://plato-manager-c3bbf.firebaseapp.com',
        icon = "https://firebasestorage.googleapis.com/v0/b/plato-9a79e.appspot.com/o/logo.png?alt=media&token=1c6777fa-4aed-45ce-a31e-fb66af8aa125";
        //updated
        if(after) {
            const bMissing = before.missing;
            const aMissing = after.missing;
            if(bMissing) {
                if(aMissing) {
                    let aMissingArr = Object.keys(aMissing);
                    let bMissingArr = Object.keys(bMissing)
                    if(aMissingArr.length > bMissingArr.length) {
                        aMissingArr = await aMissingArr.filter( ( el ) => !bMissingArr.includes( el ) );
                        const val = await writeMessages(aMissingArr, rest, restID, mealName, url, icon);
                        return val;
                    } else {
                        bMissingArr = await bMissingArr.filter( ( el ) => !aMissingArr.includes( el ) );
                        const val = await writeMessages(bMissingArr, rest, restID, mealName, url, icon);
                        return val;
                    }
                    
                }
            } else if (aMissing) {
                const aMissingArr = Object.keys(aMissing);
                const val = await writeMessages(aMissingArr, rest, restID, mealName, url, icon);
                return val;
            } else {
                return 0;
            }
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