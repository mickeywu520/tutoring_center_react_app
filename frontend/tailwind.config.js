/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Original colors
        'primary-blue-700': '#1D4ED8',
        'primary-blue-600': '#2563EB',
        'primary-blue-500': '#3B82F6',
        'primary-blue-100': '#DBEAFE',
        'secondary-emerald-700': '#047857',
        'secondary-emerald-500': '#10B981',
        'accent-amber-400': '#FBBF24',
        'neutral-gray-900': '#111827',
        'neutral-gray-700': '#374151',
        'neutral-gray-200': '#E5E7EB',
        'neutral-white': '#FFFFFF',
        // Brand colors
        'brand-primary': '#1D4ED8',
        'brand-secondary': '#10B981',
        'brand-accent': '#4AB7E0',
        'brand-background': '#F8FAFC',
        'brand-surface': '#FFFFFF',
        'brand-text': '#1F2937',
        'brand-text-light': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}