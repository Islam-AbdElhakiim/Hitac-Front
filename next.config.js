/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')
const nextConfig = {
    i18n,
    env: {
        BASE_URL: 'http://localhost:3002/',
        // BASE_URL: 'https://islamabdelhakiim.xyz/',
      },
};


module.exports = nextConfig;
