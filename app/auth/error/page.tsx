import Link from "next/link";
import { TerminalBackground } from "@/app/components/TerminalBackground";
import { TerminalPrompt } from "@/app/components/TerminalPrompt";
import { TerminalWindow } from "@/app/components/TerminalWindow";
import { generateBanner } from "@/lib/figlet";

export default async function AuthErrorPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const params = await searchParams;
    const isAccessDenied = params.error === "AccessDenied";

    return (
        <TerminalBackground>
            <div className="max-w-2xl w-full px-4 mx-auto">
                <TerminalWindow title="~/auth/error" variant="error">
                    {/* ASCII Art Error Header */}
                    <pre className="text-red-500 text-xs sm:text-sm mb-6 overflow-x-auto whitespace-pre leading-tight">
                        {generateBanner("Error")}
                    </pre>

                    {/* Error Log Style */}
                    <div className="space-y-4 mb-8">
                        <TerminalPrompt command="cat /var/log/auth.log" />

                        <div className="bg-zinc-900/50 border border-red-500/30 rounded p-4 space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="text-red-500 shrink-0 font-bold">
                                    [ERROR]
                                </span>
                                <div className="flex-1">
                                    <p className="text-red-400 text-sm sm:text-base font-medium">
                                        {isAccessDenied
                                            ? "Access Denied - Authentication Failed"
                                            : "Authentication Error"}
                                    </p>
                                </div>
                            </div>

                            <div className="pl-16 text-zinc-400 text-xs sm:text-sm space-y-1">
                                <p>
                                    {isAccessDenied
                                        ? "• User not found in whitelist"
                                        : "• Authentication process interrupted"}
                                </p>
                                <p>
                                    {isAccessDenied
                                        ? "• Discord ID not authorized"
                                        : "• Please retry the authentication"}
                                </p>
                                <p className="text-zinc-500 text-xs mt-2">
                                    Error Code:{" "}
                                    {params.error || "UNKNOWN_ERROR"}
                                </p>
                            </div>
                        </div>

                        {isAccessDenied && (
                            <div className="border-l-2 border-yellow-500/50 pl-4 py-2">
                                <p className="text-yellow-500 text-xs sm:text-sm flex items-center gap-2">
                                    <span className="font-bold">[INFO]</span>
                                    <span>
                                        Votre compte Discord n&apos;est pas
                                        autorisé à accéder à cette application.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation Button */}
                    <div className="space-y-4">
                        <TerminalPrompt command="./navigate --home" />

                        <Link href="/" className="block group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-linear-to-r from-red-500/20 via-orange-500/20 to-red-500/20 rounded blur-sm group-hover:blur-md transition-all" />

                                <div className="relative bg-zinc-900 border-2 border-red-500/50 rounded px-6 py-4 hover:border-red-400 hover:bg-zinc-800 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="text-red-400 text-lg sm:text-xl">
                                            &lt;
                                        </span>
                                        <span className="font-mono text-red-400 text-sm sm:text-base font-medium">
                                            RETURN_TO_HOME()
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Status Footer */}
                    <div className="mt-6 pt-6 border-t border-red-500/20">
                        <p className="font-mono text-xs text-zinc-600">
                            Session terminated •{" "}
                            {new Date().toISOString().split("T")[0]}{" "}
                            {new Date().toTimeString().split(" ")[0]}
                        </p>
                    </div>
                </TerminalWindow>

                {/* Bottom Status */}
                <div className="mt-4 px-2">
                    <p className="font-mono text-xs text-red-400/50">
                        Authentication failed • Redirecting to home...
                    </p>
                </div>
            </div>
        </TerminalBackground>
    );
}
