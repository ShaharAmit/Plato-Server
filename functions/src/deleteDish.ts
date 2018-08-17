import * as firebase from '../lib/firebase.js'
import { HttpsError } from 'firebase-functions/lib/providers/https';

const fb = new firebase();

function checkIfMealsContainDish(restId: string, dishName: string): Promise<{ contains: boolean, containingMeal: string }> {
    return new Promise<{ contains: boolean, containingMeal: string }>((resolve, reject) => {
        fb.db.collection(`/RestAlfa/${restId}/Meals`).get().then(meals => {
            let mealsChecked = 0;
            const totalMeals = meals.docs.length;

            if (totalMeals === 0) {
                resolve({ contains: false, containingMeal: undefined });
            }

            console.log('totalMeals', totalMeals);
            meals.docs.forEach(meal => {
                fb.db.collection(`/RestAlfa/${restId}/Meals/${meal.id}/dishes`).where("id", "==", dishName).get()
                    .then(dishes => {
                        if (dishes.docs.length > 0) {
                            resolve({
                                contains: true,
                                containingMeal: meal.id
                            });
                            return;
                        }
                        mealsChecked++;
                        console.log('meals checked', mealsChecked);

                        //Check if all meals have been checked
                        if (mealsChecked === totalMeals) {
                            resolve({ contains: false, containingMeal: undefined });
                        }

                    }).catch(reject);
            });
        }).catch(reject);
    })
}

exports.handler = async (data, context) => {
    const restId = data.restId;
    const dish = data.dish;

    return new Promise((resolve, reject) => {
        checkIfMealsContainDish(restId, dish.name).then(x => {
            if (x.contains) {
                reject(new HttpsError('aborted', `Dish is contained in other meal(${x.containingMeal})`));
                return;
            }

            fb.db.doc(`/RestAlfa/${restId}/Dishes/${dish.name}`).delete().then(resolve).catch(reject);

        }).catch(reject);
    });
};