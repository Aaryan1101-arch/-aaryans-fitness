export default {
  name: 'galleryItem',
  title: 'Gallery Photo',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      validation: (R) => R.required(),
    },
    {
      name: 'caption',
      title: 'Caption / alt text',
      type: 'string',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Ambience', value: 'ambience'},
          {title: 'Members', value: 'member'},
          {title: 'Equipment', value: 'equipment'},
          {title: 'Events', value: 'event'},
        ],
        layout: 'radio',
      },
      initialValue: 'ambience',
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
    select: {title: 'caption', subtitle: 'category', media: 'image'},
    prepare({title, subtitle, media}) {
      return {title: title || subtitle || 'Photo', subtitle, media}
    },
  },
}
