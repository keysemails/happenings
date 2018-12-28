import firebase from 'firebase';
import base from '../utils/rebase';
import { saveUserData } from './user';

/**
 * Functions for handling all authentication related things
 */

export function signUpNewUser(userInfo) {
	const auth = base.initializedApp.auth();
	auth.createUserWithEmailAndPassword(userInfo.email, userInfo.password).then((response) => {
		// this could also be set by Google sign in provider or something
		const fullName = (userInfo.fullName || response.displayName);
		const userName = userInfo.userName;
		// add public user info to the database
		saveUserData(response.uid, userName, fullName, response.photoURL);
	}).catch((error) => {
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorMessage);
	})
}

export function signInWithEmailAndPassword(email, password) {
	const auth = base.initializedApp.auth();
	return auth.signInWithEmailAndPassword(email, password)//.then((response) => {
// 	}).catch((error) => {
// 		var errorCode = error.code;
// 		var errorMessage = error.message;
// 		if (errorCode == 'auth/wrong-password') {
// 			alert('wrong password');
// 		} else {
// 			alert(errorMessage);
// 		}
// 	});
}

export function signUserOut() {
	console.log('bye');
	return base.initializedApp.auth().signOut();
}

export function getAuth() {
	return base.initializedApp.auth();
}
