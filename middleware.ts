import { auth } from "./auth";

export default auth((_req) => {
    // Add your middleware logic here
});

export const config = {
    matcher: ["/admin/:path*"],
};
