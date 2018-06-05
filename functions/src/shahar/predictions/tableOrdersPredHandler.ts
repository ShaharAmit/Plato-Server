import * as firebase from '../../../lib/firebase.js'
const fb = new firebase(),
    request = require('request');

function Paginate(ref,last) {
    ref.orderBy('name','desc').startAfter(last).limit(3).get().then(docs => {
        //send http
        if(docs.docs.length) {
            const lastSeen = docs.docs[docs.docs.length-1]
            Paginate(ref,lastSeen);
        }
    });
}

exports.handler = async (req, res) => {
    const rest = req.query.rest,
        ref = fb.db.collection(rest);
        ref.orderBy('name','desc').limit(3).get().then(docs => {  
            // request('https://maps.googleapis.com/maps/api/timezone/json?location='+lat+','+long+'&timestamp='+time+'&key='+key, { json: true }, (err, resp, body) => {
                
            // });              
            const lastSeen = docs.docs[docs.docs.length-1]
            Paginate(ref,lastSeen);
        }).catch(err => {
            console.log(err);
        });
 }  

 