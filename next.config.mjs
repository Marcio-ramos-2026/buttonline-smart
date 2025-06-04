import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
			{
				protocol: 'https',
				hostname: 'tailwindui.com'
			},
            {
				protocol: 'https',
				hostname: 'images.memphistours.com'
			},
			{
				protocol: 'https',
				hostname: 'encrypted-tbn0.gstatic.com'
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com'
			},
			{
				protocol: 'https',
				hostname: 'cdn.pixabay.com'
			},
        ],
        dangerouslyAllowSVG: true,
    },
	experimental: {
		serverComponentsExternalPackages: ["pdfkit"]
	},
};

export default withNextIntl(nextConfig);
