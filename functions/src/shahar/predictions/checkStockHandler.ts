import * as firebase from '../../../lib/firebase.js'
const fb = new firebase(),
    request = require('request');

function sendReq(restID,rest) {
    fb.db.doc(rest + '/' + restID + '/restGlobals/predictionParams').get().then(doc => {
        if(doc.data()) {
            const data = doc.data(),
                utc = data.utc,
                stockPredict = data.stockPredict;
            if(stockPredict) {
                request('https://us-central1-plato-9a79e.cloudfunctions.net/checkStockPrediction?restID='+restID+'&utc='+utc, { json: true }, (err, resp, body) => {
                    if(err) console.log(err);
                    else console.log(body);
                });
            } 
        }
    })
}
function Paginate(ref,last,res,rest) {
    ref.orderBy('name','desc').startAfter(last).limit(1).get().then(docs => {
        if(docs.docs.length>0) {
            docs.forEach(doc => {
                const restID = doc.id;
                sendReq(restID,rest); 
            });
            const lastSeen = docs.docs[docs.docs.length-1]
            Paginate(ref,lastSeen,res,rest);
        } else {
            res.status(200).send('sent all requests');
        }
    });
}

exports.handler = async (req, res) => {
    const rest = fb.rest,
        ref = fb.db.collection(rest);
        ref.orderBy('name','desc').limit(1).get().then(docs => { 
            docs.forEach(doc => {
                const restID = doc.id;
                sendReq(restID,rest); 
            });
            const lastSeen = docs.docs[docs.docs.length-1]
            Paginate(ref,lastSeen,res,rest);
        }).catch(err => {
            console.log(err);
            res.status(404).send('fail to send all requests');
        });
 }  

 