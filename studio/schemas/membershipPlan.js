export default {
  name: 'membershipPlan',
  title: 'Membership Plan',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Plan name',
      type: 'string',
      validation: (R) => R.required(),
      description: 'e.g., "Bill Monthly"',
    },
    {
      name: 'price',
      title: 'Price (display)',
      type: 'string',
      validation: (R) => R.required(),
      description: 'Whatever you want shown — e.g., "RS 3000" or "NPR 25,000".',
    },
    {
      name: 'features',
      title: 'What’s included',
      type: 'array',
      of: [{type: 'string'}],
      validation: (R) => R.min(1),
    },
    {
      name: 'isPopular',
      title: 'Show "Popular" badge?',
      type: 'boolean',
      initialValue: false,
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
    select: {title: 'name', subtitle: 'price', popular: 'isPopular'},
    prepare({title, subtitle, popular}) {
      return {title: `${title || 'Plan'}${popular ? ' ★' : ''}`, subtitle}
    },
  },
}
