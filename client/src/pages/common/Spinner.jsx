export const Spinner = () => {
  return (
    <div className="h-screen grid place-items-center">
      <div className="grid place-items-center">
        <div className="rounded-full w-20 h-20 animate-spin border-t-transparent border-blue-800 border-4"></div>
        <h4 className="mt-3 text-3xl">Loading....</h4>
      </div>
    </div>
  );
};
