import firebase from 'firebase';
import base from './rebase';

import * as DateUtil from './dates';

// pseudo-global firebase import crap
const storage = base.initializedApp.storage();
const database = base.initializedApp.database();

/**
 * @param  {object} storateRef - the firebase cloud storage location to upload
 * @param  {File} localImage - the local image file to upload
 * @param  {Function} callback - callback function
 * @return {Promise} - the upload promise
 */
function uploadImgFile(storageRef, localImage, callback) {
  const metadata = {
    contentType: localImage.type
  };
  return storageRef.put(localImage, metadata).then(snapshot => {
    console.log('uploaded new pic of size ', snapshot.totalBytes, 'bytes.');
    let imgUrl = snapshot.metadata.downloadURLs[0];
    return imgUrl;
  }).catch(error => {
    callback({status: 'ERROR', 'message': error})
  });
}


/**
 * @param  {string} postID - the postID to listen on
 * @return {Promise} - resolves when a thumb URL has been written
 * to the DB by the generateThumbnail cloud function
 */
function listenForThumbnailGeneration(postID) {
  return database.ref(`/posts/${postID}/thumb_url`).on('value', data => {
    return true
  });
}


/**
 * get derived date fields from form data for event schema
 * @param  {object} formData containing string date fields
 * @return {object}  containing timestamp and date_string
 */
function _getDerivedDateFields({year, month, day, hour, minute}) {
  const dateObj = DateUtil.parseDate({year, month, day, hour, minute});
  const event_timestamp = dateObj.valueOf();  // UNIX timestamp of event date
  const date_string = dateObj.format(DateUtil.DATE_FORMAT_STRING);
  return { event_timestamp, date_string };
}


function _getEventUpdateObject(existingEventData, newFormData) {
  const { event_timestamp, date_string } = _getDerivedDateFields(newFormData);
  return {
    ...existingEventData,
    event_timestamp: event_timestamp,
    date_string: date_string,

    title: newFormData.title,
    location: newFormData.location,
    description: newFormData.description,

    isPrivate: newFormData.isPrivate,
    isAccessible: newFormData.isAccessible,
    guestsCanInvite: newFormData.guestsCanInvite,
    ageRestriction: newFormData.ageRestriction
  }
}


function _cleanUpOldImages(storageRef, fullStorageUrl, thumbStorageUrl) {
  console.log('deleting these');
  console.log(fullStorageUrl, thumbStorageUrl);
  storageRef.refFromURL(fullStorageUrl).delete();
  storageRef.refFromURL(thumbStorageUrl).delete();
}

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
export function uploadEventData(currentUser, formData, localImage, callback) {
  const { uid, username } = currentUser;
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
  const imgUploadTask = uploadImgFile(imgRef, localImage, callback);

  /** 
   * This listener promise lets us know when the generateThumbnail cloud function
   *  has finished executing (it updates the DB record with thumb_url info).
   */
  const thumbGenerationTask = listenForThumbnailGeneration(newPostKey);

  /**
   * ensure that the upload and thumbnail generation complete successfully before
   * gathering and writing the rest of the event's data to the DB.
   */
  var preconditions = [imgUploadTask, thumbGenerationTask];
  return Promise.all(preconditions).then(data => {
    const { event_timestamp, date_string } = _getDerivedDateFields(formData);

    const updates = {};
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

      title: formData.title,
      location: formData.location,
      description: formData.description,

      isPrivate: formData.isPrivate,
      isAccessible: formData.isAccessible,
      guestsCanInvite: formData.guestsCanInvite,
      ageRestriction: formData.ageRestriction
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

/**
 * @param  {object} currentUser - currentuser from session
 * @param {string} postID - the ID of the pre-existing event
 * @param  {object} eventData - the form data from the redux store
 * @param  {File} localImage - the optional new image to upload
 * @param  {Function} callback - for error handling, etc
 * @return {[type]}
 */
export function updateEventData(currentUser, postID, eventData, formData, localImage, callback) {
  // redux defaults localImage to null
  const replaceExistingImage = localImage !== null;
  if (replaceExistingImage) {
    return updateEventImageData(currentUser, postID, eventData, formData, localImage, callback);
  } else {
    return updateEventFields(currentUser, postID, eventData, formData, callback);
  }
}


function updateEventImageData(currentUser, postID, eventData, formData, localImage, callback) {
  const { uid, username } = currentUser;

  const fileName = localImage.name;
  const newImgRef = storage.ref(`${uid}/full/${postID}/${fileName}`);
  const imgUploadTask = uploadImgFile(newImgRef, localImage, callback);
  const thumbGenerationTask = listenForThumbnailGeneration(postID);

  return Promise.all([imgUploadTask, thumbGenerationTask]).then(data => {
    const full_img_url = data[0];
    const updates = {};
    const eventBody = _getEventUpdateObject(eventData, formData);
    eventBody.full_url = full_img_url;
    eventBody.full_storage_uri = newImgRef.toString();
    updates[`/posts/${postID}`] = eventBody;

    return database.ref().update(updates).then(() => {
      // after new image uploads complete, delete the old ones from the bucket!
      _cleanUpOldImages(storage, eventData.full_storage_uri, eventData.thumb_storage_uri);
      callback({status: 'SUCCESS', message: postID})
    }).catch(error => {
      callback({status: 'ERROR', message: error})
    });
  });
}


function updateEventFields(currentUser, postID, eventData, formData, callback) {
  const { uid, username } = currentUser;

  const updates = {};
  const eventBody = _getEventUpdateObject(eventData, formData);
  updates[`/posts/${postID}`] = eventBody;
  return database.ref().update(updates).then(() => {
    callback({status: 'SUCCESS', message: postID})
  }).catch(error => {
    callback({status: 'ERROR', message: error})
  });
}
