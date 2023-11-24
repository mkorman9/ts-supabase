-- disable public access
revoke all privileges on database postgres from anon;
revoke all privileges on schema public from anon;
revoke all privileges on schema storage from anon;
revoke all privileges on all sequences in schema public from anon;
revoke all privileges on all sequences in schema storage from anon;
revoke all privileges on all functions in schema public from anon;
revoke all privileges on all functions in schema storage from anon;
revoke all privileges on all tables in schema public from anon;
revoke all privileges on all tables in schema storage from anon;

revoke all privileges on database postgres from authenticated;
revoke all privileges on schema public from authenticated;
revoke all privileges on schema storage from authenticated;
revoke all privileges on all sequences in schema public from authenticated;
revoke all privileges on all sequences in schema storage from authenticated;
revoke all privileges on all functions in schema public from authenticated;
revoke all privileges on all functions in schema storage from authenticated;
revoke all privileges on all tables in schema public from authenticated;
revoke all privileges on all tables in schema storage from authenticated;

revoke all on all routines in schema public from public;

-- todo_items
create table todo_items (
    id         uuid          constraint todo_items_pkey primary key,
    content    varchar(255)
);

alter table todo_items enable row level security;
create policy todo_items_deny_anon
    on todo_items
    for ALL
    to anon
    using (false);
create policy todo_items_deny_auth
    on todo_items
    for ALL
    to authenticated
    using (false);
