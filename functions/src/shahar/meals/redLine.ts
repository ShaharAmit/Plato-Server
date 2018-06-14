import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();
exports.handler = async (change, context) => {
    try {
        const rest = context.params.rest,
            restID = context.params.restID,
            rawMaterial = context.params.rawMaterial,
            batch = fb.db.batch(),
            ref = fb.db.doc(rest + '/' + restID + '/WarehouseStock/' + rawMaterial);
        await ref.collection('Meals').get()
            .then(docs => {
                let max: number = 0;
                docs.forEach(doc => {
                    const docVals = doc.data();
                    if (max < docVals.redLine) {
                        max = docVals.redLine;
                    }
                });
                return max;
            }).then(redLine => {
                batch.set(ref,{
                    value: {
                        redLine: redLine
                    }
                },{ merge: true });
                return batch.commit().then(()=> console.log('redLine updated'))
            }).catch(err => {
                console.error(err);
            });
    } catch (err) {
        console.error(err);
    }
}