import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (change, context) => {
    const rest = context.params.rest,
        restID = context.params.restID,
        uid = context.params.uid,
        data = change.data(),
        ref = fb.db.doc('GlobWorkers/'+uid),
        batch = fb.db.batch();

        batch.set(ref,{
            name: data.name,
            role: data.role,
            email: data.email
        });
        
        batch.set(ref.collection('/Rest/').doc(restID),{
            [restID]: true
        })
        
        batch.commit().then(() => {
            console.log('created user: ', uid);
            return 0;
        }).catch(err => {
        console.error(err);
        return 0;
    });
 }

 