export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Service title',
      type: 'string',
      validation: (R) => R.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'morningHours',
      title: 'Morning hours',
      type: 'string',
      initialValue: '7 AM to 9 AM',
    },
    {
      name: 'eveningHours',
      title: 'Evening hours',
      type: 'string',
      initialValue: '6 PM to 8 PM',
    },
    {
      name: 'order',
      title: 'Display order (lower = first)',
      type: 'number',
      initialValue: 100,
    },
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', media: 'image'},
  },
}
