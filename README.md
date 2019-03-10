# happenings
TODO: brief explanation of file structure

## DB "Tables" (nodes):
The current design of our data layer is pretty arcane, as we're currently developing a social media (read: _highly relational_) data model against a NoSQL database (firebase realtime database). Get wrecked! Read more about this type of pain below. Builds character maybe?

### followers
`/followers/${uid}/${uid_of_follower}`

Stores a user's followers for every user.

### feed
`/feed/${uid}/${post_id}`

For each user, stores a list of post IDs of posts from people a user follows.

### comments
`/comments/${post_id}/${comment_id}`

Stores comment info and meta-info for each post. The value under each comment_id is an object author, text string, and timestamp info.

### posts
`/posts/${post_id}`
Holds post detail info such as author_uid, creation timestamp, event timestamp, location, description, etc.

### likes (should technically rename to stars)
`/likes/${post_id}/${uid}`

Stores a uid for each user that has liked or "starred". TODO: make the value at each uid key the *event_timestamp* so we can more easily query a chronological timeline of events a user has "starred". [DEPRECATED and replaced with post_stars and user_stars as of Feb 2019].


### post_stars
`/post_stars/${post_id}/${uid}`
Holds information about which users "starred" a given post. Allows us to do something like `select * from tables.stars where post_id == <some_value` in NoSQL land.

### user_stars
`/user_stars/${uid}/${post_id}`
Holds information about which posts a given user has starred. Allows us to do something like `select * from tables.stars where user_uid == <some_val>` in NoSQL land. The _value_ at the `${post_id}` key is an event_timestamp, so one can easily query a chronological ordering of events that a given user has starred.


### attends_posts
`/attends_posts/${post_id}/${uid}`

Keeps track of who is attending what event with post_id as the `post_id` as first child and `uid` as second child. Useful for quickly querying which users are attending a given event.

### attends_users
`/attends_users/${uid}/${post_id}`

Keeps track of what events a given user is attending. `uid` is first child, `post_id` is second child. Useful for quickly querying which events a given user is attending.

## Google Cloud Functions (lambdas)
### generateThumbnail
This one generates thumbnails for every image that is uploaded to the bucket. It runs as a trigger on the bucket upload event, and uses ImageMagick to write out the thumbnail.
### BlurOffensiveImages
This one uses image classification to identify and blur NSFW image content. (not live rn)
### cleanupDeletedAccount
TODO: implement. Background job to remove all the likes and stars etc after a user decides to delete their entire account.

## Cloud Storage (for event images)
Our event posters are stored in buckets. When an image is uploaded into our bucket, a Google Cloud Function is triggered. This function uses ImageMagick to create a thumbnail version of the new image. The thumbnail is stored at a deterministic location within the same bucket.

### Full size images
`<HAPPENINGS_BUCKET>/${uid}/full/${new_post_key}/${filename}`

### Thumbnails (only difference is a `thumb_` prefix)
`<HAPPENINGS_BUCKET>/${uid}/full/${new_post_key}/thumb_${filename}`
