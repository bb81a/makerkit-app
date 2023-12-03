begin;

select
  no_plan ();

\echo ============
\echo USERS
\echo ============
select
  lives_ok ($$ insert into auth.users (id)
      values ('0414aff1-834d-4613-9c93-1b45ec9ddea1');

$$,
'can create an auth user');

\echo Test that a USER cannot be created WHEN anonymous
set LOCAL role anon;

select
  throws_ok ($$ insert into users (id, onboarded)
      values ('0414aff1-834d-4613-9c93-1b45ec9ddea1', true);

$$,
'new row violates row-level security policy for table "users"',
'cannot create a user without being authenticated');

select
  *
from
  finish ();

rollback;
