-- users
create table private.users (
    id       uuid         constraint users_pkey primary key,
    username varchar(255)
);

-- todo_items
create table public.todo_items (
    id      uuid         constraint todo_items_pkey primary key,
    content varchar(255)
);

alter table todo_items enable row level security;
create policy todo_items_anon_deny_all
    on todo_items
    to anon
    using (false);
create policy todo_items_anon_allow_select
    on todo_items
    for SELECT
    to anon
    using (true);
create policy todo_items_authenticated_deny_all
    on todo_items
    to authenticated
    using (false);
create policy todo_items_authenticated_allow_select
    on todo_items
    for SELECT
    to authenticated
    using (true);
