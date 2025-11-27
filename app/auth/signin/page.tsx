import { signIn } from "@/auth";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                    Sign in with your Discord account to access the admin area
                </p>
                <form
                    action={async () => {
                        "use server";
                        await signIn("discord", { redirectTo: "/admin" });
                    }}
                >
                    <button
                        type="submit"
                        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Sign in with Discord
                    </button>
                </form>
            </div>
        </div>
    );
}
