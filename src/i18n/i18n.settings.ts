import configuration from '~/configuration';

const fallbackLng = configuration.site.locale ?? 'en';
const languages: string[] = [fallbackLng];

export const I18N_COOKIE_NAME = 'lang';

/**
 * The default array of Internationalization (i18n) namespaces.
 * These namespaces are commonly used in the application for translation purposes.
 *
 * Add your own namespaces here
 **/
export const defaultI18nNamespaces = [
  'common',
  'auth',
  'organization',
  'profile',
  'subscription',
  'onboarding',
];

function getI18nSettings(
  language: Maybe<string>,
  ns: string | string[] = defaultI18nNamespaces,
) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng: language ?? fallbackLng,
    fallbackNS: defaultI18nNamespaces,
    defaultNS: defaultI18nNamespaces,
    ns,
  };
}

export default getI18nSettings;
