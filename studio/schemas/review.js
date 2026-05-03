export default {
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Reviewer name',
      type: 'string',
      validation: (R) => R.required(),
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'review',
      title: 'Review text',
      type: 'text',
      rows: 4,
      validation: (R) => R.required(),
    },
    {
      name: 'rating',
      title: 'Star rating (1–5)',
      type: 'number',
      validation: (R) => R.min(1).max(5).integer(),
      initialValue: 5,
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
    select: {title: 'name', subtitle: 'review'},
    prepare({title, subtitle}) {
      return {title, subtitle: subtitle?.slice(0, 80)}
    },
  },
}
