export default function SplashPage() {
  return (
    <>
      <div className="loading-search form-input"></div>
      <div className="loading-nav">
        <div
          className="loading-circle"
          {...{ pos: 1 }}
          style={{ animationDelay: "60ms" }}
        ></div>
        <div
          className="loading-circle"
          {...{ pos: 2 }}
          style={{ animationDelay: "120ms" }}
        ></div>
        <div
          className="loading-circle"
          {...{ pos: 3 }}
          style={{ animationDelay: "180ms" }}
        ></div>
        <div
          className="loading-circle"
          {...{ pos: 4 }}
          style={{ animationDelay: "240ms" }}
        ></div>
        <div
          className="loading-circle"
          {...{ pos: 5 }}
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </>
  );
}
