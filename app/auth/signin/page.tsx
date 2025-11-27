import { FaDiscord } from "react-icons/fa";
import { TerminalBackground } from "@/app/components/TerminalBackground";
import { TerminalPrompt } from "@/app/components/TerminalPrompt";
import { TerminalWindow } from "@/app/components/TerminalWindow";
import { signIn } from "@/auth";
import { generateBanner } from "@/lib/figlet";

export default function SignInPage() {
    return (
        <TerminalBackground>
            <div className="max-w-2xl w-full px-4 mx-auto">
                <TerminalWindow title="~/auth/signin">
                    {/* ASCII Art Header */}
                    <pre className="text-green-400 text-xs sm:text-sm mb-6 overflow-x-auto whitespace-pre leading-tight">
                        {generateBanner("Login")}
                    </pre>

                    {/* Command prompt style */}
                    <div className="space-y-4 mb-8">
                        <TerminalPrompt>
                            <p className="text-green-400/90 text-sm sm:text-base">
                                cat auth/requirements.txt
                            </p>
                            <p className="text-zinc-400 mt-2 text-xs sm:text-sm leading-relaxed">
                                # ACCÈS RESTREINT - ADMINISTRATEURS UNIQUEMENT
                            </p>
                            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                                # Authentification Discord requise
                            </p>
                            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                                # Liste blanche activée
                            </p>
                        </TerminalPrompt>

                        <TerminalPrompt command="./auth --provider discord" />
                    </div>

                    {/* Discord auth button styled as terminal command */}
                    <form
                        action={async () => {
                            "use server";
                            await signIn("discord", {
                                redirectTo: "/admin",
                            });
                        }}
                    >
                        <button type="submit" className="w-full group relative">
                            {/* Glowing border effect */}
                            <div className="absolute inset-0 bg-linear-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 rounded blur-sm group-hover:blur-md transition-all" />

                            <div className="relative bg-zinc-900 border-2 border-green-500/50 rounded px-6 py-4 hover:border-green-400 hover:bg-zinc-800 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-green-400 text-lg sm:text-xl">
                                            &gt;
                                        </span>
                                        <span className="font-mono text-green-400 text-sm sm:text-base font-medium">
                                            AUTHENTICATE_WITH_DISCORD()
                                        </span>
                                    </div>
                                    <FaDiscord className="text-[#5865F2] text-2xl sm:text-3xl group-hover:scale-110 transition-transform" />
                                </div>
                            </div>
                        </button>
                    </form>

                    {/* Status message */}
                    <div className="mt-6 pt-6 border-t border-green-500/20">
                        <p className="font-mono text-xs text-zinc-600 flex items-center gap-2">
                            <span className="text-yellow-500">[WARN]</span>
                            Seuls les utilisateurs autorisés peuvent se
                            connecter
                        </p>
                    </div>
                </TerminalWindow>

                {/* Bottom terminal prompt */}
                <div className="mt-4 px-2">
                    <p className="font-mono text-xs text-green-400/50">
                        Session initiated • Awaiting authentication...
                    </p>
                </div>
            </div>
        </TerminalBackground>
    );
}
