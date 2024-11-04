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
				hostname: 'static.mundoeducacao.uol.com.br'
			}
		],
		dangerouslyAllowSVG: true,
	},
	reactStrictMode: false

};

export default nextConfig;
