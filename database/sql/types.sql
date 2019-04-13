-- enumerated types

create type happenings.activity_t as enum('STAR', 'COMMENT', 'ATTEND');
create type happenings.user_t as enum('PERSON', 'PLACE', 'THING');
create type happenings.notification_t as enum(
	'FOLLOWED_BY_USER', 'USER_ATTENDING', 'USER_COMMENTED', 'USER_STARRED',
	'INVITE_TO_EVENT', 'SHARE_EVENT', 'EVENT_TIME_CHANGE', 'EVENT_CANCELLED',
	'EVENT_UPDATED'
);
create type happenings.age_restriction_t as enum('AGES_21', 'AGES_18', 'AGES_ALL');