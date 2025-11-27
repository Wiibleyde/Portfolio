import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminPage() {
    const session = await auth();

    if (!session) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Session Information
                    </h2>
                    <div className="flex items-start gap-6">
                        {session.user?.image && (
                            <Image
                                src={session.user.image}
                                alt="Profile"
                                width={80}
                                height={80}
                                className="rounded-full"
                            />
                        )}
                        <div className="space-y-2 flex-1">
                            <p>
                                <strong>Username:</strong>{" "}
                                {session.user?.name || "N/A"}
                            </p>
                            <p>
                                <strong>Discord ID:</strong>{" "}
                                {session.user?.discordId}
                            </p>
                            <p>
                                <strong>User ID:</strong> {session.user?.id}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-green-800 dark:text-green-200">
                        ✅ You have successfully accessed the protected admin
                        area!
                    </p>
                </div>

                <form
                    action={async () => {
                        "use server";
                        const { signOut } = await import("@/auth");
                        await signOut();
                    }}
                    className="mt-6"
                >
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}
