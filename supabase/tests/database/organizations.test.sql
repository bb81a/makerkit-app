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
      (id, name)
      from organizations
      where
        name = 'Supabase';

$$,
'an authenticated user can read an organization it is a member of');

select
  tests.authenticate_as ('user-2');

select
  create_new_organization ('Test', tests.get_supabase_uid ('user-2'));

select
  is_empty ($$
    select
      * from organizations
      where
        id = 0 $$, 'an user cannot read an organization it is not a member of');

select
  *
from
  finish ();

rollback;

