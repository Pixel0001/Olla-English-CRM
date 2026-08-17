// CRM intern — nimic nu trebuie indexat de motoarele de căutare.
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
  }
}
