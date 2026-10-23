/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      // Kurzlinks, wie sie im Discord stehen
      { source: "/ZeldaDE/regelwerk", destination: "/zelda-de/regelwerk", permanent: true },
      { source: "/zeldade/regelwerk", destination: "/zelda-de/regelwerk", permanent: true },
      { source: "/ZeldaDE", destination: "/projekte/zelda-de-server", permanent: false },
    ];
  },
};

export default nextConfig;
