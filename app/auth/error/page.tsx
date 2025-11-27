export default async function AuthErrorPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const params = await searchParams;

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-red-600">
                    Authentication Error
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                    {params.error === "AccessDenied"
                        ? "You are not authorized to access this application. Your Discord ID is not in the allowed list."
                        : "An error occurred during authentication. Please try again."}
                </p>
                <div className="flex justify-center">
                    <a
                        href="/"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
