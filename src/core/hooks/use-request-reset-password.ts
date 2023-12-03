import useSWRMutation from 'swr/mutation';
import useSupabase from '~/core/hooks/use-supabase';

interface Params {
  email: string;
  redirectTo: string;
}

/**
 * @name useRequestResetPassword
 * @description Requests a password reset for a user. This function will
 * trigger a password reset email to be sent to the user's email address.
 * After the user clicks the link in the email, they will be redirected to
 * /password-reset where their password can be updated.
 */
function useRequestResetPassword() {
  const client = useSupabase();
  const key = ['auth', 'reset-password'];

  return useSWRMutation(key, (_, { arg: params }: { arg: Params }) => {
    return client.auth
      .resetPasswordForEmail(params.email, {
        redirectTo: params.redirectTo,
      })
      .then((result) => {
        if (result.error) {
          throw result.error;
        }

        return result.data;
      });
  });
}

export default useRequestResetPassword;
