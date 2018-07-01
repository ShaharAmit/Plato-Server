import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (req, res) => {
    const rest = fb.rest,
        utc = req.query.utc,
        restID = req.query.restID,
        batch = fb.db.batch(),
        today = new Date(),
        utcTime = new Date(),
        statisticalRef = fb.db.doc(rest + '/' + restID + '/restGlobals/restStatistical'),
        mealsRef = fb.db.collection(rest + '/' + restID + '/MealsRanking'),
        mealsRank = [];
    let highestMealRank = 0;

    mealsRef.get().then(docs => {
        const promises = [];
        docs.forEach(doc => {
            promises.push(mealsRef.doc(doc.id).collection('Rank3').get().then(docss => {
                if (docss) {
                    mealsRank[doc.id] = docss.size;
                    console.log(restID, doc.id, docs.size);
                }
            }));
        });
        return Promise.all(promises).then(() => {
            const mealKeys = Object.keys(mealsRank);
            if (mealKeys.length > 0) {
                for (let i = 1; i <= mealKeys.length; i++) {
                    if (highestMealRank < mealsRank[mealKeys[i - 1]]) {
                        highestMealRank = i;
                        console.log(restID, 'highestMealRank', mealsRank[mealKeys[i]]);
                    }
                }
                if (highestMealRank !== 0) {
                    batch.set(statisticalRef, {
                        mostRankedMeal: mealKeys[highestMealRank - 1],
                    }, {
                        merge: true
                    });
                }
            }
        }).catch(err => {
            res.status(404).send(err)
        })
    }).then(() => {
        batch.commit().then(() => {
            console.log(`finshed ading to ${restID}`)
            res.status(200).send(`complete adding all the data to ${restID}`)
        }).catch(err => {
            console.log(err);
            res.status(404).send(err);
        });
    }).catch(err => {
        res.status(404).send(err);
        console.log(err)
    });
}