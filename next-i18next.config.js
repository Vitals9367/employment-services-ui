const languages = [
  { code: 'fi', text: 'Suomi' },
  { code: 'sv', text: 'Svenska' },
  { code: 'en', text: 'English' }
]

const locales = languages.map(({ code }) => code)

module.exports = {
  i18n: {
    ...(process.env.NODE_ENV === 'development' && { reloadOnPrerender: true }),
    locales,
    defaultLocale: 'fi',
    localeDetection: false
  }
}
