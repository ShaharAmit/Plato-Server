import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (req, res) => {
    const rest = fb.rest,
        utc = req.query.utc,
        restID = req.query.restID;

    const today = new Date(),
        batch = fb.db.batch(),
        now = new Date(),
        restRef = fb.db.doc(rest + '/' + restID),
        mealsRef = restRef.collection('Meals'),
        mealRankingRef = restRef.collection('MealsRanking'),
        mealRanking = [];
        today.setTime(today.getTime() + Number(utc));
    let todayDate:string = '';
    if (today.getHours() < 5 ) {
        now.setDate(today.getDate() -1);
        todayDate = `${today.getFullYear()}` + '-' + `${today.getMonth()}` + '-' + `${now.getDate()}`;
    } else {
        todayDate = `${today.getFullYear()}` + '-' + `${today.getMonth()}` + '-' + `${today.getDate()}`;
    }
    const dayRef = fb.db.doc(rest + '/' + restID + '/YearlyRanking/' + `${today.getDay()}` + '/Days/' + todayDate);
    console.log(dayRef);
    for(let i=0; i<3; i++) {
        mealRanking[i] = {};
    }
    await mealsRef.get().then(async docs => {
        if(docs) {
            const promises = [];
            docs.forEach(doc => {
                promises.push(mealRankingRef.doc(doc.id).collection('Rank1').get().then(allRank1 => {
                    if(allRank1) {
                        mealRanking[0][doc.id] = allRank1.size;
                    }
                }));
                promises.push(mealRankingRef.doc(doc.id).collection('Rank2').get().then(allRank2 => {
                    if(allRank2) {
                        mealRanking[1][doc.id] = allRank2.size;
                    }
                }));
                promises.push(mealRankingRef.doc(doc.id).collection('Rank3').get().then(allRank3 => {
                    if(allRank3) {
                        mealRanking[2][doc.id] = allRank3.size;
                    }
                }));
            }); 
            const x = await Promise.all(promises).then(() => {return true});
            return x;
        } else {
            return false;
        }
    }).then((check) => {
        if(check) {
            batch.set(dayRef, {
                timestamp: today.getTime(),
                mealsRanking: {
                    Rank1: mealRanking[0],
                    Rank2: mealRanking[1],
                    Rank3: mealRanking[2]
                }
            },{ merge: true });
            //TODO: delete from ranks
            batch.commit().then(() => res.status(200).send(`complete adding all the data to ${restID}`)).catch(err => {console.log(err); res.status(404)});
        } else {
            res.status(200).send(`no new data to ${restID}`)
        }
    }).catch(err => {console.log(err); res.status(404);});    
}