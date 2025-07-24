import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
}


export default nextConfig;
