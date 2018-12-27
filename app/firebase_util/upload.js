import firebase from 'firebase';
import base from './rebase';

import { getAuth } from './auth';
import { getUsername } from './index';

export function uploadEvent(eventObj, pic, fileName, callback) {

	/**
	 * This function triggers a lot of different things related to uploading a new event:
	 * 
	 * 1. the event image is uploaded to cloud storage
	 * 
	 * 2. Upon this upload, the generateThumbnail cloud function is triggered.
	 *    It does the following things:
	 *		- creates a thumbnail from the image using ImageMagick
	 *		- uploads that thumbnail to cloud storage
	 *		- updates the DB record at `/posts/newPostKey` with the thumbnail location
	 *
	 * 3. After steps 1 & 2 complete, we add the rest of the event info at `/posts/newPostKey`
	 *
	 * 4. Only after steps 1, 2, and 3 complete, we report back to the frontend the
	 * 	  status of the uploadEvent operation (success / error).
	 */

	let auth = getAuth();
	let storage = base.initializedApp.storage();
	let database = base.initializedApp.database();
	const metadata = {
		contentType: pic.type
	};

	const newPostKey = database.ref('/posts').push().key;

	// start the pic upload to cloud storage
	const imgRef = storage.ref(`${auth.currentUser.uid}/full/${newPostKey}/${fileName}`);

	let imgUploadTask = imgRef.put(pic, metadata).then(snapshot => {
		console.log('uploaded new pic of size ', snapshot.totalBytes, 'bytes.');
		let url = snapshot.metadata.downloadURLs[0];
		return url;
	}).catch(error => {
		callback({status: 'ERROR', 'message': error})
	});

	// sad.. if we use Redux we don't need to constantly ask DB for username.
	const usernameTask = getUsername(auth.currentUser.uid).then(snapshot => {
		const username = snapshot.val();
		return username;
	});

	// This promise lets us know when the generateThumbnail cloud function
	// has finished executing (it updates the DB record with thumb_url info).
	const thumbTask = database.ref(`/posts${newPostKey}`).on('value', data => {
		return true;
	});

	var promises = [imgUploadTask, usernameTask, thumbTask];

	return Promise.all(promises).then(data => {
		const updates = {};
		updates[`/posts/${newPostKey}`] = {
			// thumb_url and thumb_storage_uri
			// should already be present in the DB. we're adding the rest now.
			full_url: data[0],
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			full_storage_uri: imgRef.toString(),
			author: {
				uid: auth.currentUser.uid,
				full_name: auth.currentUser.displayName,
				profile_picture: auth.currentUser.photoURL,
				username: data[1],
			},
			title: eventObj.title,
			location: eventObj.location,
			description: eventObj.description,
			event_timestamp: eventObj.timestamp,
			date_string: eventObj.date_string,
		};
		updates[`/people/${auth.currentUser.uid}/posts/${newPostKey}`] = true;
		updates[`/feed/${auth.currentUser.uid}/${newPostKey}`] = true;

		return database.ref().update(updates).then(() => {
			callback({status: 'SUCCESS', message: newPostKey});
		});
	});
}