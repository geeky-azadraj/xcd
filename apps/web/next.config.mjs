import { env } from "./env.mjs"

/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  experimental: { instrumentationHook: true },
  //TODO: Dummy image domains need to be removed
  images: {
    domains: ["avatar.vercel.sh","images.unsplash.com"],
  },
  rewrites() {
    return []
  },
}

export default config
