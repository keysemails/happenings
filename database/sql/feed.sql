/** 
 * Function to put a newly uploaded post into the main feeds of a users followers.
 * This could become expensive if the user has an extremely high amount of followers.
 */
create or replace function happenings.main_feed_fanout(user_id integer, post_id integer) returns void as $$
declare
    followed_user_id integer := user_id;
    new_post_id integer := post_id;
begin
    delete from happenings.main_feed m
    where m.user_id = followed_user_id
    and m.post_id = new_post_id;

    insert into happenings.main_feed(user_id, post_id)

        with followers as (
            select f.follower_id from happenings.followers f
            where f.user_id = followed_user_id
        )
        select
            f.follower_id, new_post_id as post_id
        from followers f;

end;
$$ language plpgsql;


/**
 * Function to put an post a user interacts with into the discover feeds of said users followers.
 * Can become expensive if the user has an extremely high amount of followers.
 */
create or replace function happenings.discover_feed_fanout(user_id integer, post_id integer, activity_t happenings.activity_t) returns void as $$
declare
    followed_user_id integer := user_id;
    interacted_post_id integer := post_id;
    interaction_type happenings.activity_t := activity_t;
begin
    insert into happenings.discover_feed(user_id, post_id, followee_id, activity_type, event_timestamp)

        with followers as (
            select f.follower_id from happenings.followers f
            where f.user_id = followed_user_id
        )
        select
            f.follower_id,
            interacted_post_id as post_id,
            followed_user_id as followee_id,
            interaction_type as activity_type,
            (
                select event_timestamp from happenings.posts
                where id = interacted_post_id
            )
        from followers f

    -- unique constraint on (user_id, post_id)
    -- simply dont do the write if exists already
    on conflict do nothing;
end;
$$ language plpgsql;
