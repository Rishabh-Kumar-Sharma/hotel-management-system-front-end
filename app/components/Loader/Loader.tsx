export const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full py-10">
      <svg
        className="animate-spin"
        width="48"
        height="48"
        viewBox="0 0 50 50"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          className="text-indigo-600 dark:text-indigo-400 opacity-20"
        />
        <path
          d="M45 25a20 20 0 0 1-20 20"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          className="text-indigo-600 dark:text-indigo-400"
        />
      </svg>
    </div>
  );
};