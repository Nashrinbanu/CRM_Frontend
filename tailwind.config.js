/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Urbanist"],
      },
      backgroundImage: {
        'global-gradient': `
          radial-gradient(circle at 20% 20%, rgba(244, 235, 223, 1) 0%, transparent 60%),
          radial-gradient(circle at 80% 20%, rgba(227, 240, 230, 1) 0%, transparent 60%),
          radial-gradient(circle at 50% 70%, rgb(150, 167, 253) 0%, transparent 75%),
          radial-gradient(circle at 50% 80%, rgba(230, 241, 241, 0.5) 0%, transparent 70%)
        `,
        'step-success': 'linear-gradient(90deg, #02b994 0%, #39789f 269.42%, #8c44af 487.95%, rgba(255, 14, 14, 0.72) 598.71%)',
        'step-primary': 'linear-gradient(90deg, #02b994 -74.62%, #2197df 60.08%, #8c44af 352.33%, rgba(255, 14, 14, 0.72) 449.24%)',
        'step-dark': 'linear-gradient(90deg, #02b994 -173.11%, #39789f 6.4%, #8c44af 244.89%, rgba(255, 14, 14, 0.72) 339.77%)',
        'step-purple': 'linear-gradient(90deg, #02b994 -364.02%, #39789f -64.29%, #8652ed 84.17%, rgba(255, 14, 14, 0.72) 228.41%)',
        'step-secondary': 'linear-gradient(90deg, #02b994 -450.76%, #39789f -278.52%, #d83abb 47.52%, #a6118b 164.39%)',
        'step-danger': 'linear-gradient(90deg, #02b994 -450.76%, #39789f -278.52%, #f42225 47.52%, #e82124 164.39%)',
        'step-lost': 'linear-gradient(90deg, #02B994 -450.76%, #39789F -278.52%, #F42225 47.52%, #E82124 164.39%)',
      },
      backgroundImage: {
        'shimmer-gradient': 'linear-gradient(90deg, #d1d5db 0%, #bfbfbf 50%, #a9a9a9 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};