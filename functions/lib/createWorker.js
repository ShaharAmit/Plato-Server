"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("../lib/firebase.js");
const fb = new firebase();
function createUser(restID, rest, role, name, email, pass) {
    fb.auth.createUser({
        email: email,
        password: pass,
        displayName: name
    }).then((userRecord) => {
        const ref = fb.db.doc('GlobWorkers/' + userRecord.uid);
        const batch = fb.db.batch();
        batch.set(fb.db.doc(ref), {
            email: email,
            password: pass,
            displayName: name,
            role: role
        });
        batch.set(ref.doc('Rest/' + restID), {
            [restID]: true
        });
        return batch.commit().then(() => {
            console.log(name + ' user created succesfully');
            return {
                name: name
            };
        }).catch(err => {
            console.error(err);
            return {
                error: err
            };
        });
    });
}
exports.handler = (data, context) => __awaiter(this, void 0, void 0, function* () {
    const auth = context.auth;
    if (!auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new fb.functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.');
    }
    else {
        const rest = data.rest, restID = data.restID, role = data.role, name = data.name, email = data.email, pass = data.pass, ref = fb.db.doc('GlobWorkers/' + auth.uid);
        ref.get().then((doc) => {
            const uidRole = doc.data().docData.role;
            if (uidRole === 'superAdmin') {
                return createUser(restID, rest, role, name, email, pass);
            }
            else if (doc.data().docData.role === 'admin') {
                ref.doc('Rest/' + restID).get().then((d => {
                    if (d.data()[`${restID}`]) {
                        return createUser(restID, rest, role, name, email, pass);
                    }
                    ;
                })).catch(err => {
                    console.error(err);
                });
            }
            else {
                return {
                    error: 'role is not admin'
                };
            }
        }).catch(err => {
            console.error(err);
            return {
                error: err
            };
        });
    }
    const uid = context.auth.uid;
});
//# sourceMappingURL=createWorker.js.map