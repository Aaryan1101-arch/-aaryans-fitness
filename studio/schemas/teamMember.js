export default {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (R) => R.required(),
    },
    {
      name: 'role',
      title: 'Role / specialty',
      type: 'string',
      description: 'e.g. "Zumba", "Head Trainer"',
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
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
    select: {title: 'name', subtitle: 'role', media: 'photo'},
  },
}
