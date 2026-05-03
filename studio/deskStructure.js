// Custom desk structure: groups singletons (Site Settings, Hero) at the top
// and shows collections (Plans, Services, etc.) below.
export const deskStructure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings'),
        ),
      S.listItem()
        .title('Hero / Landing')
        .id('heroSection')
        .child(
          S.document()
            .schemaType('heroSection')
            .documentId('heroSection')
            .title('Hero / Landing'),
        ),
      S.divider(),
      S.documentTypeListItem('membershipPlan').title('Membership Plans'),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('galleryItem').title('Gallery Photos'),
      S.documentTypeListItem('teamMember').title('Team Members'),
      S.documentTypeListItem('review').title('Reviews'),
    ])
