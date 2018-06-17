import * as firebase from '../../../lib/firebase.js'
const fb = new firebase(),
    request = require('request');

exports.handler = (req, res) => {
    const rest = fb.rest,
        restID = req.query.restID,
        time = (Date.now()/1000),
        key = fb.googleApiKey,
        ref = fb.db.doc(rest+'/'+restID);
    ref.get().then(doc => {
        return doc.data().location;
    }).then(location => {
        const lat = location.latitude,
            long = location.longitude;
        request('https://maps.googleapis.com/maps/api/timezone/json?location='+lat+','+long+'&timestamp='+time+'&key='+key, { json: true }, (err, resp, body) => {
            if (err) { 
                console.log(err); 
                res.status(400).send('fail'); 
            } else {
                const utc = body.dstOffset + body.rawOffset;
                ref.collection('restGlobals').doc('predictionParams').update({utc: utc*1000}).then(res.status(200).send('changed utc'))
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(404).send('fail'); 
    });
 }

 
 
