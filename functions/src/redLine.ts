import * as firebase from '../lib/firebase.js'
const fb = new firebase();
exports.handler = async (change, context) => {
    try {
        const rest = context.params.rest;
        const restID = context.params.restID;
        const rawMaterial = context.params.rawMaterial
        fb.db.collection(rest+'/'+restID+'/WarehouseStock/'+rawMaterial+'/Meals')
            .get()
            .then(docs => {
                let max:number = 0;
                docs.forEach(doc => {
                    const docVals = doc.data();
                    if(max < docVals.redLine) {
                        max = docVals.redLine;
                    }
                });    
                const ref = fb.db.doc(rest+'/'+restID+'/WarehouseStock/'+rawMaterial);
                ref.get()
                .then((doc) => {
                if(doc) {
                    return doc.data().value;
                }
                }).then(data => {
                    ref.update({
                        value : {
                            amount : data.amount,
                            redLine : max,
                            type : data.type,
                            unit : data.unit,
                            name : data.name
                        }
                    }).then(func => {
                        console.log('updated redLine'); 
                        return 0
                    });
                })
            }).catch(err => {
              console.error(err);
            });
    } catch(err) {
        console.error(err);
    }    
}