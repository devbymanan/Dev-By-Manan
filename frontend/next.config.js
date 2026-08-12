/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        // Render backend serves uploaded project images / resume in production.
        // Update this once the real Render service URL is known.
        hostname: "*.onrender.com",
      },
    ],
  },
};

module.exports = nextConfig;
