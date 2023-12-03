import ConvertkitSignupForm from '~/components/newsletter/ConvertkitSignupForm';
import configuration from '~/configuration';
import Heading from '~/core/ui/Heading';

function NewsletterSignup() {
  return (
    <div className={'flex flex-col space-y-4'}>
      <div>
        <Heading type={6}>Subscribe to our Newsletter</Heading>

        <div className={'text-sm text-gray-500 dark:text-gray-400'}>
          Get the latest updates from our team.
        </div>
      </div>

      <div>
        <ConvertkitSignupForm formId={configuration.site.convertKitFormId}>
          Subscribe
        </ConvertkitSignupForm>
      </div>
    </div>
  );
}

export default NewsletterSignup;
