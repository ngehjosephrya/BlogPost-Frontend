import { Link } from "react-router";

type LogoMarkProps = {
  linkDisabled?: boolean;
};

export function LogoMark({ linkDisabled = false }: LogoMarkProps) {
  const content = (
    <>
      <div className="flex flex-col gap-1 justify-center w-5">
        <span className="block h-[2.5px] w-full bg-gray-900 dark:bg-white rounded-sm" />
        <span className="block h-[2.5px] w-[65%] bg-gray-900 dark:bg-white rounded-sm" />
      </div>
      VIBELY
    </>
  );

  if (linkDisabled) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium
                      text-gray-900 dark:text-white cursor-default">
        {content}
      </div>
    );
  }

  return (
    <Link
      to="/"
      className="flex items-center gap-2 text-sm font-medium
                 text-gray-900 dark:text-white"
    >
      {content}
    </Link>
  );
}