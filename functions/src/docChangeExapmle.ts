import * as firebase from '../lib/firebase.js'
const fb = new firebase();
async function hello() {
    console.log(hello)
    return true;
}

exports.handler = async function(data, context) {
    const test = await hello();
    return 0;
 }

 