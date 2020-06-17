module.exports = {
  purge: [
    "./src/**/*.html",
    "./src/**/*.vue"
  ],

  theme: {
    extend: {
      colors: {
        gray: {
          100: "#f5f5f5",
          200: "#eeeeee",
          300: "#e0e0e0",
          400: "#bdbdbd",
          500: "#9e9e9e",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121",
        },
        border: "#dce3e6",
        primary: "#181F48",
        secondary: "#424242",
        accent: "#003c9e",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107"
      },
      height: {
        inherit: "inherit"
      },
      screens: {
        print: { raw: "print" }
      }
    }
  },

  variants: {
    borderWidth: [ "responsive", "last", "hover", "focus" ],
    height: [ "responsive", "important" ],
    margin: [ "responsive", "last" ]
  },

  plugins: [
    ({ addVariant }) => {
      addVariant("important", ({ container }) => {
        container.walkRules((rule) => {
          rule.selector = `.\\!${rule.selector.slice(1)}`
          rule.walkDecls((decl) => {
            decl.important = true
          })
        })
      })
    }
  ]
}
