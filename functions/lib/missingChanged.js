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
function writeMessages(missing, rest, restID, mealName, url, icon) {
    const batch = fb.db.batch();
    for (const rawMaterial of missing) {
        batch.set(fb.db.doc(rest + '/' + restID + '/Messages/' + mealName), {
            title: restID,
            body: mealName + ' missing ' + rawMaterial,
            url: url,
            icon: icon
        });
    }
    return batch.commit().then(() => { console.log('messages added'); }).catch(err => console.log(err));
}
function removeMessages(bMissing, rest, restID, mealName) {
    const batch = fb.db.batch();
    for (const rawMaterial of bMissing) {
        batch.delete(fb.db.doc(rest + '/' + restID + '/Messages/' + mealName));
    }
    return batch.commit().then(() => { console.log('messages removed'); }).catch(err => console.log(err));
}
exports.handler = (change, context) => __awaiter(this, void 0, void 0, function* () {
    try {
        const before = change.before.data(), after = change.after.data(), rest = context.params.rest, restID = context.params.restID, mealName = context.params.mealName, url = 'https://plato-manager-c3bbf.firebaseapp.com', icon = "https://firebasestorage.googleapis.com/v0/b/plato-9a79e.appspot.com/o/logo.png?alt=media&token=1c6777fa-4aed-45ce-a31e-fb66af8aa125";
        //updated
        if (after) {
            const bMissing = before.missing;
            const aMissing = after.missing;
            if (bMissing) {
                if (aMissing) {
                    let aMissingArr = Object.keys(aMissing);
                    let bMissingArr = Object.keys(bMissing);
                    if (aMissingArr.length > bMissingArr.length) {
                        aMissingArr = yield aMissingArr.filter((el) => !bMissingArr.includes(el));
                        const val = yield writeMessages(aMissingArr, rest, restID, mealName, url, icon);
                        return val;
                    }
                    else {
                        bMissingArr = yield bMissingArr.filter((el) => !aMissingArr.includes(el));
                        const val = yield writeMessages(bMissingArr, rest, restID, mealName, url, icon);
                        return val;
                    }
                }
            }
            else if (aMissing) {
                const aMissingArr = Object.keys(aMissing);
                const val = yield writeMessages(aMissingArr, rest, restID, mealName, url, icon);
                return val;
            }
            else {
                return 0;
            }
        }
        else if (before) {
            const bMissing = before.missing;
            const bMissingArr = Object.keys(bMissing);
            const val = yield removeMessages(bMissingArr, rest, restID, mealName);
            return val;
        }
        else {
            return 0;
        }
    }
    catch (err) {
        console.error(err);
    }
});
//# sourceMappingURL=missingChanged.js.map