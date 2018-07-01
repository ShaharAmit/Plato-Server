import * as firebase from '../../../lib/firebase.js'
const fb = new firebase(),
    mealRanking = [],
    yearMonthlyRanking = mealRanking;



function checkRanks(rank,rankNum) {
    if(rank) {
        const rank1Keys = Object.keys(rank);
        for(const meal of rank1Keys) {
            if(mealRanking[rankNum][meal]) {
                mealRanking[rankNum][meal] += rank[meal];
            } else {
                mealRanking[rankNum][meal] = rank[meal];
            }
        };
    }
}

function checkRankss(rank,rankNum) {
    if(rank) {
        const rank1Keys = Object.keys(rank);
        for(const meal of rank1Keys) {
            if(yearMonthlyRanking[rankNum][meal]) {
                yearMonthlyRanking[rankNum][meal] += rank[meal];
            } else {
                yearMonthlyRanking[rankNum][meal] = rank[meal];
            }
        };
    }
}

exports.handler = async (req, res) => {
    const rest = fb.rest,
        utc = req.query.utc,
        restID = req.query.restID;

    const today = new Date(),
        lastMonth = new Date(),
        batch = fb.db.batch(),
        restRef = fb.db.doc(rest + '/' + restID),
        promises = [],
        mealRankingRef = restRef.collection('YearlyRanking');
    today.setTime(today.getTime() + Number(utc));
    lastMonth.setMonth(today.getMonth() - 1);

    const monthlyCollectedDataRef = restRef.collection('MonthlyCollectedData'),
    yearRef = monthlyCollectedDataRef.doc(`${lastMonth.getFullYear()}`),
    monthRef = yearRef.collection(`${lastMonth.getMonth()}`).doc();
    lastMonth.setHours(0);
    lastMonth.setMinutes(0);
    console.log(lastMonth.getTime());
    for(let i=0; i<3; i++) {
        mealRanking[i] = {};
    }
    for(let i=0; i<7; i++) {
        promises.push(mealRankingRef.doc(`${i}`).collection('Days').where("timestamp", ">", lastMonth.getTime()).get());
    }

    Promise.all(promises).then(allDocs => {
        if(allDocs) {
            allDocs.forEach(docs => {
                if(docs) {
                    docs.forEach(doc => {
                        if(doc) {
                            const data = doc.data();
                            if(data) {
                                const mealsRanking = data.mealsRanking;
                                if(mealsRanking) {
                                    const rank1 = mealsRanking.Rank1,
                                        rank2 = mealsRanking.Rank2,
                                        rank3 = mealsRanking.Rank3
                                    checkRanks(rank1,0);
                                    checkRanks(rank2,1);
                                    checkRanks(rank3,2);
                                }
                            }
                        }
                    });
                }
            })
        }
    }).then(() => {
        batch.set(monthRef, {
            mealsRanking: {
                Rank1: mealRanking[0],
                Rank2: mealRanking[1],
                Rank3: mealRanking[2]
            }
        },{ merge: true });
    }).then(() => {
        const promisess = [];
        if(today.getMonth() === 0) {
            for(let i=0; i<11; i++) {
                promisess.push(yearRef.collection(`${i}`).get());
            }
        }
        Promise.all(promisess).then(allDocs => {
            if(allDocs) {
                allDocs.forEach(docs => {
                    if(docs) {
                        docs.forEach(doc => {
                            if(doc) {
                                const data = doc.data();
                                if(data) {
                                    const mealsRanking = data.mealsRanking;
                                    if(mealsRanking) {
                                        const rank1 = mealsRanking.Rank1,
                                            rank2 = mealsRanking.Rank2,
                                            rank3 = mealsRanking.Rank3
                                        checkRankss(rank1,0);
                                        checkRankss(rank2,1);
                                        checkRankss(rank3,2);
                                    }
                                }
                            }
                        });
                    }
                })
            }
            batch.commit().then(() => res.status(200).send(`complete adding all the data to ${restID}`)).catch(err => {console.log(err); res.status(404)});
        }).catch(err => {console.log(err); res.status(404);});
    }).catch(err => {console.log(err); res.status(404);});        
}
