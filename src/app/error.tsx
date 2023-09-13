"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!!!</h2>
      <button type="button" onClick={() => reset()} className="form-button">
        Try Again
      </button>
    </div>
  );
}
