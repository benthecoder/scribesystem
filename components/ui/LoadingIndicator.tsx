import { useEffect, useState, useRef } from 'react';

export const RetroProgress = () => {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    // Start with faster progress
    const fastInterval = setInterval(() => {
      if (progressRef.current < 70) {
        progressRef.current += 5;
        setProgress(progressRef.current);
      }
    }, 200);

    // Slower progress as we approach "completion"
    const slowInterval = setInterval(() => {
      if (progressRef.current >= 70 && progressRef.current < 90) {
        progressRef.current += 1;
        setProgress(progressRef.current);
      }
    }, 500);

    // Very slow progress near the end
    const finalInterval = setInterval(() => {
      if (progressRef.current >= 90 && progressRef.current < 95) {
        progressRef.current += 0.5;
        setProgress(progressRef.current);
      }
    }, 1000);

    return () => {
      clearInterval(fastInterval);
      clearInterval(slowInterval);
      clearInterval(finalInterval);
      progressRef.current = 0;
    };
  }, []);

  return (
    <div className="w-48 flex flex-col gap-2">
      <div className="h-5 border-2 border-gray-700 bg-white p-0.5">
        <div
          className="h-full bg-blue-900 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="font-chicago text-sm text-center text-[#808080]">
        analyzing...
      </div>
    </div>
  );
};
