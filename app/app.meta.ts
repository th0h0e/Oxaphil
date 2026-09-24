export default {
  id: 'Oxaphil',
  name: 'Oxaphil',
  description: 'Oxaphil Pharma, Biotech und Kosmetik',
  localBusiness: {
    name: 'Oxaphil',
    description: 'Oxaphil Pharma, Biotech und Kosmetik',
    url: 'https://oxaphil.de',
    // '@type': 'Organization', // or a LocalBusiness subtype, e.g. 'ProfessionalService'
    address: {
      streetAddress: '…',
      addressLocality: 'Dresden',
      addressRegion: 'Sachsen',
      postalCode: '01099', // Update with correct postal code
      addressCountry: 'DE'
    },
    telephone: '+49 155 65330061', // from content/bestellung.yml contactCard
    email: 'erik@oxaphil.com', // from contactEmail
    sameAs: [
      'https://de.linkedin.com/company/oxaphil',
      'https://x.com/oxaphil' // matches the 'i-simple-icons-x' link in app.config.ts
    ],
    logo: '/img/news-oxaphil-logo.png'
  },
  url: 'https://oxaphil.de',
  icon: '/favicon.ico',
  contactEmail: 'erik@oxaphil.com'
}
