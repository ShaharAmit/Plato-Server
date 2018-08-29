import * as firebase from '../lib/firebase.js'
import * as admin from 'firebase-admin'
import { document } from 'firebase-functions/lib/providers/firestore';
const fb = new firebase();

admin.initializeApp();

exports.handler = (data, context) => {
    //Uncomment when authentication is available
    // console.log("checking auth");
    // console.log(JSON.stringify(context));
    // if (!context.auth) {
    //     throw new HttpsError("unauthenticated", "You are not logged in");
    // }

    const restId = data.restId;
    const orders = {};
    let ordersCount = 0;
    let ordersInitialized = 0;
    return new Promise((resolve, reject) => {

        fb.db.collection(`/${fb.rest}/${restId}/Orders`).get().then(ordersQuerySnapshot => {

            ordersQuerySnapshot.forEach(orderQueryDocSnapshot => {
                orders[orderQueryDocSnapshot.id] = {
                    dishes: {}
                };
                ordersCount++;
            });
            console.log('orders count', ordersCount);

            for (let orderDoc of ordersQuerySnapshot.docs) {
                fb.db.collection(`${orderDoc.ref.path}/meals`).get().then(mealsQuerySnapshot => {
                    for (let mealDoc of mealsQuerySnapshot.docs) {
                        fb.db.collection(`${mealDoc.ref.path}/dishes`).get().then(dishesQuerySnapshot => {
                            dishesQuerySnapshot.forEach(dishQueryDocSnapshot => {
                                const dish = dishQueryDocSnapshot.data();
                                const minutes = parseInt(dish.totalTime.substring(0, 2));
                                const seconds = parseInt(dish.totalTime.substring(3, 5));
                                dish.totalSeconds = (minutes * 60) + seconds;
                                orders[orderDoc.id].dishes[dishQueryDocSnapshot.id] = dish;
                            });

                            const longestDishTime = Object.keys(orders[orderDoc.id].dishes).reduce((max, dishId) => {
                                const value = orders[orderDoc.id].dishes[dishId];
                                return value.totalSeconds > max.seconds ? { seconds: value.totalSeconds, dishId } : max;
                            }, { seconds: 0, dishId: '' });
                            orders[orderDoc.id].longestDishTime = longestDishTime;

                            ordersInitialized++;
                            console.log('order initialized', ordersInitialized);
                            if (ordersInitialized === ordersCount) {
                                console.log('resolving');
                                resolve(orders);
                            }
                        })
                    }
                })
            }
        });
    });
};