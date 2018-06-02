import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (change, context) => {
    const restID = context.params.restID,
        mealID = context.params.mealID,
        rest = context.params.rest,
        before = change.before.data(),
        after = change.after.data(),
        updateRef = fb.db.doc(rest+'/'+restID+'/Meals/'+mealID);
        if(after && before) {
            const aMissingArr = Object.keys(after.missing),
                bMissingArr = Object.keys(before.missing);
            //if old missing bigger then new missing and menu is not displayed
            if(!after.displayed && bMissingArr.length > aMissingArr.length) {
                if(aMissingArr.length > 0) {
                    console.log('missing > 0');
                    //run over after to check if important
                    let t:any = false;
                    const promises = [];
                    for(const rawMat of aMissingArr) {
                        const ref = fb.db.doc(rest+'/'+restID+'/WarehouseStock/'+rawMat+'/Meals/'+mealID);
                        promises.push(ref.get());
                    }
                    Promise.all(promises).then(docs => {
                        docs.forEach(doc => {
                            console.log('importance',doc.data().importance);
                            t = doc.data().importance;
                        });
                    }).then(() => {
                        console.log('t',t);
                        if(!t) {
                            console.log('false - backToMenu');
                            updateRef.update({
                                displayed: true
                            });
                        }
                        return 0;
                    });
                } else {
                    console.log('missing = 0');
                    console.log('backToMenu');
                    updateRef.update({
                        displayed: true
                    });
                    return 0;
                }
            } else {
                return 0;
            }
        } 
    console.log('wierd behavior...', after);
    return 0;
        
}