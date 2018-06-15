# happenings
TODO: brief explanation of file structure

## DB "Tables" (nodes):
### followers
`/followers/${uid}/${uid_of_follower}`

Stores a user's followers for every user.

### feed
`/feed/${uid}/${post_id}`

For each user, stores a list of post IDs of posts from people a user follows.

### comments
`/comments/${post_id}/${comment_id}`

Stores comment info and meta-info for each post. The value under each comment_id is an object author, text string, and timestamp info.

### likes (should technically rename to stars)
`/likes/${post_id}/${uid}`

Stores a uid for each user that has liked or "starred". TODO: make the value at each uid key the *event_timestamp* so we can more easily query a chronological timeline of events a user has "starred"

### posts
`/posts/${post_id}`

Stores each post and its meta-info


### attends_posts
`/attends_posts/${post_id}/${uid}`

Keeps track of who is attending what event with post_id as the `post_id` as first child and `uid` as second child. Useful for quickly querying which users are attending a given event.

### attends_users
`/attends_users/${uid}/${post_id}`

Keeps track of what events a given user is attending. `uid` is first child, `post_id` is second child. Useful for quickly querying which events a given user is attending.

## Cloud Storage (for event images)
Our event posters are stored in buckets. When an image is uploaded into our bucket, a Google Cloud Function is triggered. This function uses ImageMagick to create a thumbnail version of the new image. The thumbnail is stored at a deterministic location within the same bucket.

### Full size images
`<HAPPENINGS_BUCKET>/${uid}/full/${new_post_key}/${filename}`

### Thumbnails
`<HAPPENINGS_BUCKET>/${uid}/thumb/${new_post_key}/thumb_${filename}`
