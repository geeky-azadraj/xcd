/* eslint-disable @typescript-eslint/no-var-requires */
const { colors: designTokensColors } = require("../../libs/utils/designTokens")

const { pick, omit } = require("lodash")
const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", "class"],
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./@/**/*.{ts,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
			...designTokensColors,
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			// secondary: {
  			// 	DEFAULT: 'hsl(var(--secondary))',
  			// 	foreground: 'hsl(var(--secondary-foreground))'
  			// },
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			body: [
  				"Figtree",
  				"ui-sans-serif",
  				"system-ui",
  				"-apple-system",
  				"system-ui",
  				"Segoe UI",
  				"Roboto",
  				"Helvetica Neue",
  				"Arial",
  				"Noto Sans",
  				"sans-serif",
  				"Apple Color Emoji",
  				"Segoe UI Emoji",
  				"Segoe UI Symbol",
  				"Noto Color Emoji",
  			],
  			sans: [
  				"Figtree",
  				"ui-sans-serif",
  				"system-ui",
  				"-apple-system",
  				"system-ui",
  				"Segoe UI",
  				"Roboto",
  				"Helvetica Neue",
  				"Arial",
  				"Noto Sans",
  				"sans-serif",
  				"Apple Color Emoji",
  				"Segoe UI Emoji",
  				"Segoe UI Symbol",
  				"Noto Color Emoji",
  			]
  		},
  		borderWidth: {
  			'0': '0',
  			'2': '2px',
  			'3': '3px',
  			'4': '4px',
  			'6': '6px',
  			'8': '8px',
  			DEFAULT: '1px'
  		},
  		minHeight: {
  			DEFAULT: defaultTheme.minHeight,
  		},
  		minWidth: {
  			DEFAULT: defaultTheme.minWidth,
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
