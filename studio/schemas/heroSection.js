export default {
  name: 'heroSection',
  title: 'Hero / Landing Section',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'backgroundImage',
      title: 'Hero background photo',
      type: 'image',
      options: {hotspot: true},
      description:
        'Full-screen image behind the headline. Wide landscape photos work best.',
    },
    {
      name: 'headline',
      title: 'Headline (red, large)',
      type: 'string',
      initialValue: "Aaryan's Fitness Club",
    },
    {
      name: 'subheading',
      title: 'Sub-heading (white, smaller)',
      type: 'text',
      rows: 2,
      initialValue:
        "At The Aaryan's Zone, we do everything to help you become your best self.",
    },
    {
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Start Today',
    },
    {
      name: 'whyChooseUsTitle',
      title: '"Why Choose Us" section title',
      type: 'string',
      initialValue: 'Why Choose Us?',
    },
    {
      name: 'whyChooseUsItems',
      title: 'Why-choose-us cards (4 recommended)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', title: 'Title', type: 'string'},
            {
              name: 'icon',
              title: 'Icon image',
              type: 'image',
              options: {hotspot: true},
            },
          ],
          preview: {
            select: {title: 'title', media: 'icon'},
          },
        },
      ],
    },
    {
      name: 'tagline1',
      title: 'Tagline (line 1)',
      type: 'string',
      initialValue: 'Ditch the excuses, grab your motivation backpack!',
    },
    {
      name: 'tagline2',
      title: 'Tagline (line 2)',
      type: 'string',
      initialValue: '"Get Ready To Reach Your Fitness Goals"',
    },
  ],
  preview: {
    select: {title: 'headline', media: 'backgroundImage'},
    prepare({title, media}) {
      return {title: title || 'Hero Section', media}
    },
  },
}
