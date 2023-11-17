import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        lightGray: "#D9D9F3",
        bgGray: "#F5F5F5",
        linkBgGray: "#44486D12",
        darkGray: "#414042",
        mainOrange: "#FF551F",
        mainBlue: "#0F8BFD",
        mdGray: "#65707E",
      }
    },
  },
  plugins: [],
}
export default config
