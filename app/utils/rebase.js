import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';

/**
 *  This file defines the connection between our frontend to Firebase.
 *  To keep things clean, we have utils files importing our re-base object.
 */

var config = {
  apiKey: "AIzaSyC1lA8fDONZuH00U8J_fUH8IRFJ8hs4fBY",
  authDomain: "happenings-1b935.firebaseapp.com",
  databaseURL: "https://happenings-1b935.firebaseio.com",
  projectId: "happenings-1b935",
  storageBucket: "happenings-1b935.appspot.com",
  messagingSenderId: "1026371810811"
};

var app = firebase.initializeApp(config);
var base = Rebase.createClass(app.database());

export default base;