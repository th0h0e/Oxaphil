export default defineAppConfig({
  global: {
    picture: {
      dark: '/img/news-oxaphil-logo.png',
      light: '/img/news-oxaphil-logo.png',
      alt: 'Oxaphil Logo'
    },
    meetingLink: 'https://cal.com/',
    email: 'erik@oxaphil.com',
    available: true
  },
  ui: {
    colors: {
      primary: 'green',
      secondary: 'slate',
      tertiary: 'yellow',
      info: 'yellow',
      success: 'green',
      warning:'yellow',
      error: 'red',
      neutral: 'mist'
    },
    pageHero: {
      slots: {
        container: 'py-12 sm:py-20 lg:py-28',
        title: 'mx-auto max-w-2xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 mx-auto max-w-2xl text-pretty text-muted'
      }
    },
    pageSection: {
      slots: {
        container: 'px-0 sm:px-3 lg:px-4',
        title: 'text-2xl sm:text-3xl lg:text-4xl text-pretty tracking-tight font-bold text-highlighted'
      }
    }
  },
  footer: {
    slots: {
    container: 'py-0 lg:py-0 lg:flex lg:items-center lg:justify-between lg:gap-x-3'
    },
    credits: `Built by Kontext ${new Date().getFullYear()}`,
    colorMode: false,
    logos: [{
      src: '/img/logo-exist.png',
      alt: 'Supported by EXIST',
      label: 'Supported by'
    }, {
      src: '/img/logo-tud.png',
      alt: 'Founded from TUD',
      label: 'Founded from'
    }, {
      src: '/img/logo-mitglied.png',
      alt: 'Mitglied'
    }],
    links: [{
      'icon': 'i-simple-icons-x',
      'to': 'https://de.linkedin.com/company/oxaphil',
      'target': '_blank',
      'aria-label': 'Oxaphil on X'
    }, {
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://de.linkedin.com/company/oxaphil',
      'target': '_blank',
      'aria-label': 'Oxaphil on Linkedin'
    }]
  }
})
