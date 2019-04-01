create user happenings password 'chateau430' nosuperuser nocreatedb nocreaterole inherit login;
grant usage on schema public to happenings;
alter user happenings set timezone='utc';

create database happenings;
\connect happenings;

drop schema if exists happenings cascade;
create schema happenings;

\ir /src/sql/types.sql;
\ir /src/sql/functions.sql;
\ir /src/sql/schemas/happenings.sql;

-- create our feed fanout stored procedures
\ir /src/sql/feed.sql;

grant usage on schema happenings to happenings;
grant select, insert, update, delete on all tables in schema happenings to happenings;
grant select, usage on all sequences in schema happenings to happenings;

select append_search_path('happenings', 'happenings');
