import * as firebase from '../lib/firebase.js'
import { basename } from 'path';
const fb = new firebase();
exports.handler = async function(change, context) {
    try {
        const rest = context.params.rest;
        const restID = context.params.restID;
        const rawMaterial = context.params.rawMaterial
        const meal = context.params.meal;
        const docs = await fb.getCol(rest+'/'+restID+'/WarehouseStock/'+rawMaterial+'/Meals');
        let max:number = 0;
        docs.forEach(doc => {
            const docVals = doc.data();
            if(max < docVals.redLine) {
                max = docVals.redLine;
            }
        });    
        let data;
        const ref = fb.db.doc(rest+'/'+restID+'/WarehouseStock/'+rawMaterial);
        await ref.get().then(function(doc){
            if(doc) {
                data = doc.data().value;
                // console.log(data);
            }
        });

        await ref.update({
            value : {
                amount : data.amount,
                redLine : max,
                type : data.type,
                unit : data.unit,
                name : data.name
            }
        })//.then(t => {console.log('done')});
    } catch(err) {
        console.log(err);
    }
    
    return 0;
 }