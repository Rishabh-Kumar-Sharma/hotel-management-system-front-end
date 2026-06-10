export const Popup = ({
  content,
  positiveButtonContent,
  negativeButtonContent,
  onPositiveButtonClick,
  onNegativeButtonClick,
  isPositiveButtonDisabled = false,
}: {
  content: React.ReactNode;
  positiveButtonContent?: string;
  negativeButtonContent?: string;
  onPositiveButtonClick?: () => void;
  onNegativeButtonClick?: () => void;
  isPositiveButtonDisabled?: boolean;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative w-80 rounded-2xl p-6 backdrop-blur-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/20 shadow-2xl">
        <div className="text-gray-800 dark:text-gray-200 mb-6 text-center text-sm">
          {content}
        </div>

        <div className="flex justify-center gap-3">
          {negativeButtonContent && (
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-white/20 transition"
              onClick={onNegativeButtonClick}
            >
              {negativeButtonContent}
            </button>
          )}

          {positiveButtonContent && (
            <button
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
              onClick={onPositiveButtonClick}
              disabled={isPositiveButtonDisabled}
            >
              {positiveButtonContent}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
