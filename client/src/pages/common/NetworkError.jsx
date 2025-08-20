// src/pages/common/NetworkError.jsx

export default function NetworkError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Network Error</h1>
        <p className="text-gray-600 mb-6">
          Oops! We couldn’t connect to the server. <br />
          Please check your connection or try again later.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
