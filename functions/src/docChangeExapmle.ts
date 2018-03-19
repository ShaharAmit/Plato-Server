import * as firebase from '../lib/firebase.js'
const fb = new firebase();
async function hello() {
    console.log(hello)
    return true;
}

exports.handler = async function(event) {
    const test = await hello();
    return 0;
 }

 