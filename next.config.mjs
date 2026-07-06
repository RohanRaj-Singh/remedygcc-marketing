/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow receipt uploads up to 12 MB (10 MB file + base64 overhead)
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
  async rewrites() {
    return [
      {
        // Clinic assets (logos, cover images) are stored on the Admin App.
        // Proxy /assets/clinics/* requests there so images render correctly
        // without needing administrators to enter absolute URLs.
        source: "/assets/clinics/:path*",
        destination: `${process.env.ADMIN_APP_URL ?? "http://127.0.0.1:3001"}/assets/clinics/:path*`,
      },
    ];
  },
};

export default nextConfig;
