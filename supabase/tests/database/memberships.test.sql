begin;

select
  no_plan ();

select
  tests.create_supabase_user ('user');

select
  tests.create_supabase_user ('user-2');

select
  tests.authenticate_as ('user');

select
  lives_ok ($$
    select
      create_new_organization ('Supabase', tests.get_supabase_uid ('user'));

$$,
'can kickstart the creation of an organization and user');

select
  isnt_empty ($$
    select
      * from memberships
      where
        id = tests.get_membership_id (
          tests.get_organization_id ('Supabase'),
          tests.get_supabase_uid ('user')
        ) $$, 'an authenticated user can read a membership if it
        belongs to the same organization');

select
  tests.authenticate_as ('user-2');

select
  is_empty ($$
    select
      * from memberships
      where
        id = 12 $$, 'an user cannot read an organization it is not a member of');

select
  is_empty ($$
    select
      * from users
      where
        id = tests.get_supabase_uid ('user') $$, 'an user cannot read the data of an user of another organization');

set local role postgres;

select
  lives_ok ($$
    select
      tests.create_db_user (tests.get_supabase_uid ('user-2')) $$, 'can create a db user');

select
  lives_ok ($$ insert into memberships (organization_id, user_id, role)
      values (tests.get_organization_id('Supabase'), tests.get_supabase_uid ('user-2')
      , 0) $$, 'insert membership into new organization');

select
  throws_ok ($$ update
      memberships
    set
      role = 1
      where
        user_id = tests.get_supabase_uid ('user-1') $$);

select
  lives_ok ($$ update
      memberships
    set
      role = 1
      where
        user_id = tests.get_supabase_uid ('user-2') $$);

select
  isnt_empty ($$ delete from memberships
    where user_id = tests.get_supabase_uid ('user-2')
    returning
      id $$);

select
  *
from
  finish ();

rollback;