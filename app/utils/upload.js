import firebase from 'firebase';
import base from './rebase';

import * as DateUtil from './dates';

/**
 * @param { object } currentUser: {
 *    uid: string,
 *    username: string
 *  }
 *  
 *  @param { object } eventData: {
 *    title: string,
 *    location: string,
 *    description: string,
 *    author: {
 *      uid: string,
 *      username: string    
 *    },
 *    event_timestamp: int,
 *    date_string: string,
 *    isPrivate: bool,
 *    isAccessible: bool,
 *    guestsCanInvite: bool,
 *    ageRestriction: enum('AGES_ALL', 'AGES_18', 'AGES_21')
 *  }
 *  
 *  @param { File } localImage [the local image file]
 *
 *  @param { Function } callback
 * 
 */
export function uploadEvent(currentUser, eventData, localImage, callback) {
  const { uid, username } = currentUser;
	let storage = base.initializedApp.storage();
	let database = base.initializedApp.database();
	const metadata = {
		contentType: localImage.type
	};
	const newPostKey = database.ref('/posts').push().key;
  const fileName = localImage.name;

	/**
   * imgUploadTask is a promise for uploading a local image to cloud storage.
   * Upon successful upload, the generateThumbnail cloud func will be triggered
   */
	const imgRef = storage.ref(`${uid}/full/${newPostKey}/${fileName}`);
	const imgUploadTask = imgRef.put(localImage, metadata).then(snapshot => {
		console.log('uploaded new pic of size ', snapshot.totalBytes, 'bytes.');
		let imgUrl = snapshot.metadata.downloadURLs[0];
		return imgUrl;
	}).catch(error => {
		callback({status: 'ERROR', 'message': error})
	});

  /** 
   * This listener promise lets us know when the generateThumbnail cloud function
   *  has finished executing (it updates the DB record with thumb_url info).
   */
	const thumbGenerationTask = database.ref(`/posts/${newPostKey}`).on('value', data => {
		return true;
	});

  /**
   * ensure that the upload and thumbnail generation complete successfully before
   * gathering and writing the rest of the event's data to the DB.
   */
  var preconditions = [imgUploadTask, thumbGenerationTask];
  return Promise.all(preconditions).then(data => {
    const updates = {};

    // get derived date fields from already-validated form
    const dateObj = DateUtil.parseDate(eventData);
    const event_timestamp = dateObj.valueOf();  // UNIX timestamp of event date
    const date_string = dateObj.format(DateUtil.DATE_FORMAT_STRING);

    updates[`/posts/${newPostKey}`] = {
			full_url: data[0],
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			full_storage_uri: imgRef.toString(),
			author: {
				uid: uid,
				username: username,
			},
			event_timestamp: event_timestamp,
			date_string: date_string,

      title: eventData.title,
      location: eventData.location,
      description: eventData.description,

      isPrivate: eventData.isPrivate,
      isAccessible: eventData.isAccessible,
      guestsCanInvite: eventData.guestsCanInvite,
      ageRestriction: eventData.ageRestriction
		};

    /**
     * Add new post to the user's profile feed and to the user's feed
     */
		updates[`/people/${uid}/posts/${newPostKey}`] = true;
		updates[`/feed/${uid}/${newPostKey}`] = true;

		return database.ref().update(updates).then(() => {
			callback({status: 'SUCCESS', message: newPostKey});
		}).catch(error => {
      callback({status: 'ERROR', message: error})
    });
	});
}