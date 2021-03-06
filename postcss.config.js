module.exports = {
  plugins: {
    'postcss-each': {},
    'postcss-conditionals': {},
    lost: {},
    'postcss-mixins': {
      mixinsFiles: './src/common/styles/mixins/mixins.css',
    },
    'postcss-preset-env': {
      stage: 0,
      preserve: false,
      importFrom: [
        './src/common/styles/variables/breakpoints.css',
        './src/common/styles/variables/colors.css',
        './src/common/styles/variables/sizing.css',
        './src/common/styles/variables/z-index.css',
        './src/common/styles/variables/spacing.css',
        './src/common/styles/variables/typography.css',
        './src/common/styles/variables/shadows.css',
      ],
    },
    'postcss-calc': {},
    'postcss-color-function': {},
  },
}
