import LoginButton from "@/components/LoginButton";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-10">

        <div className="text-center">

          <div className="text-6xl mb-6">
            🤖
          </div>

          <h1 className="text-4xl font-bold">
            AI Content Analyzer
          </h1>

          <p className="mt-4 text-gray-500">
            Sign in to analyze images and keep your analysis history securely.
          </p>

        </div>

        <div className="mt-10 flex justify-center">
          <LoginButton />
        </div>

      </div>

    </main>
  );
}
