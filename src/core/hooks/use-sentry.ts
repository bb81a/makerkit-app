import { useEffect } from 'react';
import initializeBrowserSentry from '~/core/sentry/initialize-browser-sentry';

/**
 * @description Hook to initialize Sentry when a component mounts. This
 * needs to be used in the root component you want to track errors for. Due
 * to its large size, we recommend you can add it to {@link RouteShell} (as is
 * by default) so it will only get loaded for the application pages
 */
function useSentry() {
  useEffect(() => {
    void initializeBrowserSentry();
  }, []);
}

export default useSentry;
