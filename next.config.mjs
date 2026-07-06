/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow receipt uploads up to 12 MB (10 MB file + base64 overhead)
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
  images: {
    remotePatterns: [
      {
        // Clinic assets (logos, cover images) are served from the Admin App
        protocol: "https",
        hostname: "admin.remedygcc.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
