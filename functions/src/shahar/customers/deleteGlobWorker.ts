import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();
exports.handler = async (change,context) => {
    const uid = context.params.uid;
    const ref = fb.db.doc('GlobWorkers/'+uid).delete()
        .then(() => {
            console.log(uid + ': worker deleted');
            return 0;
        }).catch(err => {
            console.error(err);
            return 0;
        });
}
