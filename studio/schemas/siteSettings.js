export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — only one document of this type
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: "Aaryan's Fitness Club",
    },
    {
      name: 'tagline',
      title: 'Tagline / Sub-name',
      type: 'string',
      initialValue: "The Aaryan's Zone",
    },
    {
      name: 'logo',
      title: 'Logo (header)',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'logoStamp',
      title: 'Logo (footer stamp)',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'favicon',
      title: 'Browser Favicon',
      type: 'image',
    },
    {
      name: 'contact',
      title: 'Contact Info',
      type: 'object',
      fields: [
        {name: 'phonePrimary', title: 'Primary phone', type: 'string'},
        {name: 'phoneSecondary', title: 'Secondary phone', type: 'string'},
        {name: 'email', title: 'Email', type: 'string'},
        {name: 'addressLine', title: 'Address (display)', type: 'string'},
        {name: 'mapUrl', title: 'Google Maps share URL', type: 'url'},
        {
          name: 'mapEmbedUrl',
          title: 'Google Maps embed URL (iframe src)',
          type: 'url',
          description:
            'On Google Maps: Share → Embed a map → copy only the src URL from the iframe HTML.',
        },
      ],
    },
    {
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        {name: 'facebook', title: 'Facebook URL', type: 'url'},
        {name: 'instagram', title: 'Instagram URL', type: 'url'},
        {name: 'whatsapp', title: 'WhatsApp URL', type: 'url'},
      ],
    },
    {
      name: 'footerCopyright',
      title: 'Footer copyright text',
      type: 'string',
      initialValue: "© Aaryan's Fitness Club. All Rights Reserved",
    },
  ],
  preview: {
    select: {title: 'siteName'},
    prepare({title}) {
      return {title: title || 'Site Settings'}
    },
  },
}
