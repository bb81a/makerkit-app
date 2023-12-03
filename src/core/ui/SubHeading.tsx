import classNames from 'clsx';

const SubHeading = ({
  children,
  className,
}: React.PropsWithChildren<{
  className?: string;
}>) => {
  return (
    <h2>
      <span
        className={classNames(
          'flex flex-col space-y-1 bg-gradient-to-br text-xl' +
            ' lg:text-2xl dark:from-white dark:via-gray-300' +
            ' dark:to-gray-400 bg-clip-text text-gray-500' +
            ' font-normal dark:text-transparent',
          className,
        )}
      >
        {children}
      </span>
    </h2>
  );
};

export default SubHeading;
