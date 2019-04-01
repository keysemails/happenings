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


create or replace function happenings.activity_fanout(user_id integer, post_id integer, activity_t happenings.activity_t) returns void as $$
declare
    followed_user_id integer := user_id;
    interacted_post_id integer := post_id;
    interaction_type happenings.activity_t := activity_t;
begin
    insert into happenings.discover_feed(user_id, post_id, followee_id, activity_type, event_timestamp)

        with followers as (
            select f.follower_id from happenings.followers f
            where f.user_id = followed_user_id
        ),
        event_timestamp as (
            select event_timestamp from happenings.posts where id = interacted_post_id
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

    on conflict do nothing;
end;
$$ language plpgsql;
