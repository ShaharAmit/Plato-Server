import * as firebase from '../lib/firebase.js'
const fb = new firebase();
exports.handler = async (user) => {
    const ref = fb.db.doc('Users/'+user.uid).delete()
        .then(() => {
            console.log('user delete');
            return 0;
        }).catch(err => {
            console.error(err);
            return 0;
        });
}
