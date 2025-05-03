// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'

export default {
  theme: {
    extend: {
      colors: {
        amber: colors.amber, // ✅ Add this line
      },
    },
  },
}
