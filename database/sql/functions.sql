create or replace function set_modified_timestamp()
returns trigger
language plpgsql
as $$
    begin
      new.modified := now();
      return new;
    end;
$$;



-- Handy function for appending to search_path!
create or replace function append_search_path(
    role_name text, schema_name text
) returns void as $$
declare
    current_search_path text;
begin
    -- First, we get the current search_path for that user
    select  replace(sc.configval,'search_path=','')
    from    pg_db_role_setting rs
    left 
    join    pg_roles r
    on      r.oid = rs.setrole,
    lateral unnest(rs.setconfig) as sc(configval)
    where   sc.configval like 'search_path=%'
    and r.rolname = role_name
    into current_search_path;

    -- It is possible that a new user is not in pg_roles. To fix this,
    -- we find the default search_path values.
    if not found then
        select boot_val
        from pg_settings
        where name='search_path'
        into current_search_path;
    end if;

    -- Prepend to search_path
    if current_search_path !~ ('(^|, )' || schema_name || '(,|$)') then
        current_search_path := current_search_path || ', ' || schema_name;
    end if;


    -- Make the changes
    execute format('alter role %I set search_path = %s', role_name, current_search_path);
end
$$ language plpgsql;
