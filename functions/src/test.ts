import * as firebase from '../lib/firebase.js'
const fb = new firebase();
async function test(path) {
    try{
        let z = await fb.getFile(path);
        return z;
    } catch(err) {
        console.log(err);
        return null;
    }
}

exports.handler = async function(req, res) {
    let answer = await test('Customers/304861412');
    console.log(answer);
    res.send('test ran successfully'); 
 }

 