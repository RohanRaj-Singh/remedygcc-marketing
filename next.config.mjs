/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow receipt uploads up to 12 MB (10 MB file + base64 overhead)
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
