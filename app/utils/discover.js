export function updateDiscover(uid, username, postId, event, interactionType) {
	const timestamp = event.event_timestamp;
	const discover_uri = `/discover/${uid}/${event_timestamp}`;
	const discover_info = {
		'postId:' postId,
		'username': username,
		'interaction_type': interaction_type
	}
	db.ref(discover_uri).push(discover_info);
}

export function broadcastActivityToFollowers()