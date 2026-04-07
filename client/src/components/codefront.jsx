import React, { useEffect, useState } from "react";

const Codefront = ({ devToken, devResetURL, initialCount = 5 }) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count <= 0) return;
    const timer = setTimeout(() => setCount((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  if (!devToken && !devResetURL) return null;

  return (
    <div className="px-10 py-3 absolute top-0 left-0 w-full bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/20 text-center shadow-md z-50">
      <p className="text-[15px] font-bold text-amber-500 uppercase tracking-widest mb-1">
        The owner of this site is <span className="text-red-400">0</span> credit for email verify.
      </p>

      {count <= 0 ? (
        <div className="space-y-2">
          {devToken && (
            <p className="text-2xl font-black text-amber-600 tracking-[0.3em] mb-1">
              {devToken}
            </p>
          )}
          {devResetURL && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                Password Reset Link
              </p>
              <a
                href={devResetURL}
                className="text-[11px] font-black text-amber-600 break-all underline hover:text-amber-700 transition-colors block"
              >
                {devResetURL}
              </a>
            </div>
          )}
        </div>
      ) : (
        <p className="text-2xl font-black text-amber-600 tracking-[0.3em] mb-1">
          Wait to show code
        </p>
      )}

      <p className="text-[10px] font-medium text-amber-500 uppercase tracking-wider">
        {count > 0 ? `Code will show in ${count}s` : "Code is now visible"}
      </p>
    </div>
  );
};

export default Codefront;