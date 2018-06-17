import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

exports.handler = async (req, res) => {
    const rest = fb.rest,
        utc = req.query.utc,
        restID = req.query.restID;

    const today = new Date();
        today.setTime(today.getTime() + Number(utc));

        const endTime = new Date();
        endTime.setTime(today.getTime());

        //+day (in sec)
        const startTime = new Date();
        startTime.setDate(endTime.getDate() -1);

        const hours = [];
        const yearRef = fb.db.collection(rest + '/' + restID + '/YearlyUse'),
        todayRef =  yearRef.doc((startTime.getDay()).toString()).collection('Days'),
        batch = fb.db.batch();
        let dayRef;
    
    await todayRef.orderBy("timestamp",'desc').limit(1).get().then(docs => {
        docs.forEach(doc => {
            dayRef = todayRef.doc(doc.id);
            console.log(doc.id);
        }); 
        for (let i = 0; i < 24; i++) {
            hours[i] = {};
        }
    });
        let job;
        const sqlQuery = `SELECT * FROM predictions.meal_orders WHERE TimeStamp BETWEEN '${startTime.getTime()}' AND '${endTime.getTime()}' AND RestID = '${restID}' AND Status = 2 OR Status = 3 ORDER BY TimeStamp Asc;`,
            options = {
                query: sqlQuery,
                useLegacySql: false
            };
        fb.bq.createQueryJob(options).then(results => {
            job = results[0];
            return job.promise();
        }).then(() => {
            // Get the job's status
            return job.getMetadata();
        }).then(metadata => {
            // Check the job's status for errors
            const errors = metadata[0].status.errors;
            if (errors && errors.length > 0) {
                throw errors;
            }
        }).then(() => {
            return job.getQueryResults();
        }).then(results => {
            const rows = results[0],
                meals={},
                rawMaterials={};
            for (const row of rows) {
                const mealJson = JSON.parse(row.MealJson);
                const mealObj = Object.keys(mealJson);
                for(const meal of mealObj) {
                    const dishObj = Object.keys(mealJson[meal]);
                    for(const dish of dishObj) {
                        const groceryObj = Object.keys(mealJson[meal][dish]);
                        for(const grocery of groceryObj) {
                            const rawMatObj = Object.keys(mealJson[meal][dish][grocery]['rawMaterial']);
                            for(const rawMat of rawMatObj) {
                                const mat = mealJson[meal][dish][grocery]['rawMaterial'][rawMat];
                                if(rawMaterials[rawMat]) {
                                    rawMaterials[rawMat] = rawMaterials[rawMat] + mat;
                                } else {
                                    rawMaterials[rawMat] = mat;
                                }
                            }
                        }
                    }
                }
                const hour = new Date();
                hour.setTime(row.TimeStamp);
                if(meals[row.MealID]) {
                    meals[row.MealID] = meals[row.MealID] + 1;
                } else {
                    meals[row.MealID] = 1;
                }

                console.log(hour.getHours());
                if(hours[hour.getHours()][row.MealID]) {
                    hours[hour.getHours()][row.MealID] = hours[hour.getHours()][row.MealID] + 1;
                } else {
                    hours[hour.getHours()][row.MealID] = 1;
                }        
            };
            for (let hour = 0; hour < 24; hour++) {
                batch.update(dayRef, {
                        ['hour'+hour]: {
                            meals: hours[hour]
                        }
                    }
                );
            }
            batch.update(dayRef, {
                mealsReal: meals,
                rawMaterialsReal: rawMaterials
            });

            batch.commit().then(() => res.status(200).send(`complete adding all the data to ${restID}`)).catch(err => {console.log(err); res.status(404)});
        }).catch(err => {console.log(err); res.status(404);});    
}