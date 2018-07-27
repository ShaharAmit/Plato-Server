import * as firebase from '../../../lib/firebase.js'
const fb = new firebase();

function sendMessage(messagesRef, meal, url, icon, bodyMessage,rank,alert) {
    const timestamp = Date.now(),
    message = {
        title: meal + ' rank',
        body: meal + bodyMessage,
        clickAction:  url,
        icon: icon,
        type: 'rank', 
        rank: rank,
        alert: alert,
        meal: meal,
        timestamp: timestamp
    }

    messagesRef.doc(String(rank)+String(meal)).set(message).then(console.log('new message inserted')).catch(err => console.log(err));
}

exports.handler = async (change, context) => {
    const rest = context.params.rest,
        restID = context.params.restID,
        meal = context.params.Meal,
        rank = context.params.rank,
        url = fb.url,
        icon = fb.icon,
        ranksRef = fb.db.collection(rest+'/'+restID+'/MealsRanking/'+meal+'/'+rank),
        messagesRef = fb.db.collection(rest+'/'+restID+'/Messages');
    fb.db.doc(rest+ '/' + restID + '/restGlobals/rankingAlerts').get().then(doc => {
        return doc.data();
    }).then(minRankData => {
        ranksRef.get().then(docs => {
            return docs.size;
        }).then(size => {
            let bodyMessage = '',
                alert = '',
                message = false;
            switch(rank) {
                case 'Rank1':
                    if(size>=minRankData.rank1) {
                        bodyMessage = ' rank today are: ' + size;
                        alert = 'badAlert';
                        message = true;
                    }
                    break;
                case 'Rank2':
                    if(size>=minRankData.rank2) {
                        bodyMessage = ' rank is average, you can get better with the meal';
                        alert = 'badAlert';
                        message = true;
                    }
                    break;
                case 'Rank3':
                    if(size>=minRankData.rank3) {
                        bodyMessage = ' good ranks today are: ' + size;
                        alert = 'goodAlert';
                        message = true;
                    }
                    break;
                default:
                    console.log('not valid path')
            }
            if(message) {
                sendMessage(messagesRef,meal,url,icon,bodyMessage,rank,alert);
            }
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}