import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (req, res) => {
    const rest = fb.rest,
        utc = req.query.utc,
        restID = req.query.restID;

    const today = new Date();
        today.setTime(today.getTime() + Number(utc));

        const yearRef = fb.db.collection(rest + '/' + restID + '/YearlyUse'),
        rawMatRef = fb.db.collection(rest+'/'+restID+'/WarehouseStock'),
        batch = fb.db.batch(),
        rawMaterialsArr=[];
    await rawMatRef.get().then(rawMats => {
        rawMats.forEach(rawMat => {
            const id = rawMat.id,
                rawMatData = rawMat.data().value,
                amount = rawMatData.amount,
                alert = rawMatData.alert;
            if(amount>0) {
                rawMaterialsArr.push({
                    amount: amount,
                    alert: alert,
                    id: id,
                    finished: false
                });
            } else {
                rawMaterialsArr.push({
                    id: id,
                    alert: 'none',
                    finished: true
                });
            }
        });
    }).then(() => {
        console.log(rawMaterialsArr);
        const promises = [];
        for(let days=0; days<7; days++) {
            const date = new Date();
            date.setDate(date.getDate() + days);
            promises.push(yearRef.doc((today.getDay()+days).toString()).collection('Days').orderBy("timestamp",'desc').limit(1).get().then(docs => {
                docs.forEach(day => {
                    const data = day.data(),
                        pred = data.rawMaterialsPred;
                    if(pred) {
                        for(let i=0; i<rawMaterialsArr.length; i++) {
                            console.log('rawMat',i);
                            if(!rawMaterialsArr[i].finished) {
                                if(pred[rawMaterialsArr[i].id]) {
                                    rawMaterialsArr[i].amount -= pred[rawMaterialsArr[i].id];
                                    if(rawMaterialsArr[i].amount<0) {
                                        if(days===0) {
                                            rawMaterialsArr[i].finished=true;
                                            rawMaterialsArr[i].alert = 'Today'; 
                                        } else if(days===1){
                                            rawMaterialsArr[i].finished=true;
                                            rawMaterialsArr[i].alert = `In ${days} day` 
                                        } else {
                                            rawMaterialsArr[i].finished=true;
                                            rawMaterialsArr[i].alert = `In ${days} days` 
                                        }                            
                                    }
                                }
                            }
                        }
                    }
                });
            }));
        }
        return Promise.all(promises);
    }).then(() => {
        for(let i=0; i<rawMaterialsArr.length; i++) {
            if(!rawMaterialsArr[i].finished) {
                rawMaterialsArr[i].alert = 'fine this week'
            }
            const newRef = rawMatRef.doc(rawMaterialsArr[i].id);
            batch.set(newRef, {
                value: {
                    alert: rawMaterialsArr[i].alert
                }
            },{merge: true});
            console.log(rawMaterialsArr[i]);
        }
        res.status(200).send(`complete adding all the data to ${restID}`);
        batch.commit().then(() => res.status(200).send(`complete adding all the data to ${restID}`)).catch(err => {console.log(err); res.status(404)});
    }).catch(err => {console.log(err); res.status(404);});    
}

        
