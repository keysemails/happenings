-- base entity tables

create table happenings.users(
    id serial primary key,
    username varchar(64) not null,
    user_type happenings.user_t default 'PERSON',
    email varchar(256) not null,
    private boolean not null default false,
    bio varchar(1024),
    created timestamptz not null default current_timestamp,
    modified timestamptz not null default current_timestamp
);
    comment on table happenings.users is 'happenings users';
    create unique index on happenings.users(username);
    create unique index on happenings.users(email);

    create trigger happenings_user_modified
    before update on happenings.users
    for each row execute procedure set_modified_timestamp();


create table happenings.posts(
    id serial primary key,
    user_id integer not null references happenings.users(id),
    username varchar(64) not null,
    event_timestamp integer not null,
    title varchar(256) not null,
    description varchar(2048),
    full_storage_uri varchar(1024) not null,
    full_url varchar(1024) not null,
    thumb_storage_uri varchar(1024) not null,
    thumb_url varchar(1024) not null,
    guests_can_invite boolean default false,
    is_accessible boolean default false,
    is_private boolean default false,
    age_restriction happenings.age_restriction_t not null default 'AGES_ALL',
    location varchar(1024), -- STRING LOCATION FOR NOW
    created timestamptz not null default current_timestamp,
    modified timestamptz not null default current_timestamp
);
    comment on table happenings.posts is 'Posts (events)';
    create index on happenings.posts(id, event_timestamp);

    create trigger happenings_post_modified
    before update on happenings.posts
    for each row execute procedure set_modified_timestamp();


create table happenings.activity(
    id serial primary key,
    event_timestamp integer not null,
    activity_type happenings.activity_t not null,
    post_id integer not null references happenings.posts(id),
    user_id integer not null references happenings.users(id),
    username varchar(64) not null,
    created timestamptz not null default current_timestamp
);
    comment on table happenings.activity is 'recorded user activity for discover feed';
    create index on happenings.activity(user_id);


create table happenings.comments(
    id serial primary key,
    post_id integer not null references happenings.posts(id),
    user_id integer not null references happenings.users(id),
    username varchar(64) not null,
    text varchar(1024) not null,
    created timestamptz not null default current_timestamp
);
    comment on table happenings.comments is 'comments on a post';
    create index on happenings.comments(post_id);


create table happenings.notifications(
    id serial primary key,
    user_id integer not null references happenings.users(id),
    post_id integer references happenings.posts(id),
    read boolean not null default false,
    created timestamptz not null default current_timestamp,
    notification_type happenings.notification_t not null,
    notifier_id integer references happenings.users(id)
);
    comment on table happenings.notifications is 'notifications for inbox';
    create index on happenings.notifications(user_id);


-- tables for relational data

create table happenings.stars(
    user_id integer not null references happenings.users(id),
    post_id integer not null references happenings.posts(id),
    created timestamptz not null default current_timestamp,
    primary key (user_id, post_id)
);
    -- user can't star a given post twice
    create unique index user_stars on happenings.stars(user_id, post_id);


create table happenings.attendance(
    user_id integer not null references happenings.users(id),
    post_id integer not null references happenings.posts(id),
    event_timestamp integer not null,
    created timestamptz not null default current_timestamp,
    primary key (user_id, post_id)
);
    comment on table happenings.attendance is 'user event attendance';
    create index on happenings.attendance(user_id, event_timestamp);


create table happenings.followers(
    user_id integer not null references happenings.users(id),
    follower_id integer not null references happenings.users(id),

    last_seen_post_id integer default null references happenings.posts(id),
    last_seen_activity_id integer default null references happenings.activity(id),
    primary key (user_id, follower_id)
);
    comment on table happenings.followers is 'users that follow a given user_id';

    -- easily get everyone that follows you
    create index on happenings.followers(user_id);
    -- easily get everyone you follow
    create index on happenings.followers(follower_id);


-- "feeds" that should probably be mviews updated by triggers!

create table happenings.main_feed(
    user_id integer not null references happenings.users(id),
    post_id integer not null references happenings.posts(id),
    created timestamptz not null,
    primary key (user_id, post_id)
);
    comment on table happenings.main_feed is 'post_ids from people you follow';
    create index on happenings.main_feed(user_id);

-- contains posts that have been interacted with by ppl u follow
-- uses the activity table which records user interactions
-- this table is populated by application code
-- TODO make this an mview that gets updated by a trigger on the activity table
create table happenings.discover_feed(
    id serial primary key,
    user_id integer not null references happenings.users(id),
    post_id integer not null references happenings.posts(id),
    activity_type happenings.activity_t,
    event_timestamp integer not null,
    username varchar(64) not null
);
    comment on table happenings.discover_feed is 'posts that people you follow interacted with';
    create index on happenings.discover_feed(user_id);
