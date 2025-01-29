import { useCallback } from "react";

const ProgressBar = ({
  cycles,
  breathCount,
}: {
  cycles: number;
  breathCount: number;
}) => {
  const getBackgroundStyle = useCallback(
    (index: number) => {
      if (breathCount === cycles) {
        return "bg-purple";
      } else if (index < breathCount) {
        return "bg-pink";
      } else if (index === breathCount) {
        return "bg-pink bg-opacity-50 animate-pulse";
      } else return "bg-white bg-opacity-50";
    },
    [breathCount, cycles],
  );

  return (
    <div className="flex h-3 w-11/12 sm:w-4/5 md:w-2/3 gap-1 mb-3">
      {Array.from({ length: cycles }).map((_, index) => (
        <div
          key={index}
          className={`h-full flex-1 rounded-sm transition-all duration-300 ease-in-out ${getBackgroundStyle(
            index,
          )}`}
        ></div>
      ))}
    </div>
  );
};

export default ProgressBar;
