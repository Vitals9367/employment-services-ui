module.exports = {
  async redirects() {
    return [
      {
        source: '/tapahtumat',
        destination: '/ajankohtaista/tapahtumat',
        permanent: true,
      },
      {
        source: '/evenemang',
        destination: '/aktuellt/evenemang',
        permanent: true,
      },
      {
        source: '/events',
        destination: '/current-matters/events',
        permanent: true,
      },
      {
        source: '/tapahtuma/:slug',
        destination: '/ajankohtaista/tapahtumat/:slug',
        permanent: true,
      },
      {
        source: '/evenemang/:slug',
        destination: '/aktuellt/evenemang/:slug',
        permanent: true,
      },
      {
        source: '/event/:slug',
        destination: '/current-matters/events/:slug',
        permanent: true,
      },
      {
        source: '/miten_loydan_toita',
        destination: '/tyonhaku/apua-tyonhakuun',
        permanent: true,
      },
      {
        source: '/hur-hittar-jag-arbete',
        destination: '/arbetssokande/hjalp-med-att-soka-jobb',
        permanent: true,
      },
      {
        source: '/how-can-i-find-work',
        destination: '/job-seeking/help-jobseeking',
        permanent: true,
      },
    ]
  },
}
