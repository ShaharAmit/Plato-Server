import * as firebase from '../../lib/firebase.js';
const fb = new firebase(),
    myFunctions = require('../../lib/index.js'),
    wrapped = test.wrap(myFunctions.testing);