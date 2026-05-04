import { useState, useEffect } from 'react'
import { supabase, supabaseConfigured } from './client'
import { FALLBACK_CONTENT } from '../sanity/fallbackContent'

// A row is "currently live" if (no start date OR started) AND (no end date OR not yet ended)
function isWithinWindow(row, nowIso) {
  if (row.starts_at && row.starts_at > nowIso) return false
  if (row.ends_at   && row.ends_at   < nowIso) return false
  return true
}

function mapToContent(settings, hero, plans, services, gallery, team, reviews, notices, offers, supplements) {
  const fb = FALLBACK_CONTENT
  const nowIso = new Date().toISOString()

  return {
    siteSettings: {
      siteName:        settings?.site_name        || fb.siteSettings.siteName,
      tagline:         settings?.tagline          || fb.siteSettings.tagline,
      logo:            settings?.logo_url         || fb.siteSettings.logo,
      logoStamp:       settings?.logo_stamp_url   || fb.siteSettings.logoStamp,
      contact: {
        phonePrimary:  settings?.phone_primary    || fb.siteSettings.contact.phonePrimary,
        phoneSecondary:settings?.phone_secondary  || fb.siteSettings.contact.phoneSecondary,
        email:         settings?.email            || fb.siteSettings.contact.email,
        addressLine:   settings?.address          || fb.siteSettings.contact.addressLine,
        mapUrl:        settings?.map_url          || fb.siteSettings.contact.mapUrl,
        mapEmbedUrl:   settings?.map_embed_url    || fb.siteSettings.contact.mapEmbedUrl,
      },
      social: {
        facebook:      settings?.facebook         || fb.siteSettings.social.facebook,
        instagram:     settings?.instagram        || fb.siteSettings.social.instagram,
        whatsapp:      settings?.whatsapp         || fb.siteSettings.social.whatsapp,
      },
      footerCopyright: settings?.footer_copyright || fb.siteSettings.footerCopyright,
    },

    hero: {
      backgroundImage: hero?.bg_image_url         || fb.hero.backgroundImage,
      headline:        hero?.headline              || fb.hero.headline,
      subheading:      hero?.subheading           || fb.hero.subheading,
      ctaLabel:        hero?.cta_label            || fb.hero.ctaLabel,
      whyChooseUsTitle:hero?.why_us_title         || fb.hero.whyChooseUsTitle,
      tagline1:        hero?.tagline1             || fb.hero.tagline1,
      tagline2:        hero?.tagline2             || fb.hero.tagline2,
      whyChooseUsItems: (hero?.why_us_items?.length ? hero.why_us_items : null)?.map((item, i) => ({
        _key:  String(i + 1),
        title: item.title,
        icon:  item.icon_url || fb.hero.whyChooseUsItems[i]?.icon || null,
      })) || fb.hero.whyChooseUsItems,
    },

    plans: plans?.length ? plans.map(p => ({
      _id:      p.id,
      name:     p.name,
      price:    p.price,
      isPopular:p.is_popular,
      features: p.features || [],
    })) : fb.plans,

    services: services?.length ? services.map(s => ({
      _id:         s.id,
      title:       s.title,
      image:       s.image_url || fb.services[0]?.image,
      morningHours:s.morning_hours,
      eveningHours:s.evening_hours,
    })) : fb.services,

    gallery: gallery?.length ? gallery.map(g => ({
      _id:     g.id,
      image:   g.image_url,
      caption: g.caption,
      category:g.category,
    })) : fb.gallery,

    team: team?.length ? team.map(t => ({
      _id:   t.id,
      name:  t.name,
      role:  t.role,
      photo: t.photo_url || fb.team[0]?.photo,
    })) : fb.team,

    reviews: reviews?.length ? reviews.map(r => ({
      _id:    r.id,
      name:   r.name,
      rating: r.rating,
      photo:  r.photo_url || fb.reviews[0]?.photo,
      review: r.review,
    })) : fb.reviews,

    // Filter time windows on the client so editors can preview and so a single
    // row update is reflected without waiting for Postgres to clock past ends_at.
    notices: (notices || []).filter(n => isWithinWindow(n, nowIso)).map(n => ({
      _id:        n.id,
      message:    n.message,
      linkUrl:    n.link_url,
      linkLabel:  n.link_label,
      tone:       n.tone || 'info',
      sortOrder:  n.sort_order ?? 0,
    })),

    offers: (offers || []).filter(o => isWithinWindow(o, nowIso)).map(o => ({
      _id:         o.id,
      title:       o.title,
      subtitle:    o.subtitle,
      description: o.description,
      badge:       o.badge,
      image:       o.image_url,
      ctaLabel:    o.cta_label,
      ctaUrl:      o.cta_url,
      isFeatured:  o.is_featured,
      sortOrder:   o.sort_order ?? 0,
    })),

    supplements: (supplements || []).map(s => ({
      _id:         s.id,
      name:        s.name,
      brand:       s.brand,
      category:    s.category || 'general',
      description: s.description,
      servingInfo: s.serving_info,
      price:       s.price,
      image:       s.image_url,
      inStock:     s.in_stock !== false,
      isFeatured:  s.is_featured,
      sortOrder:   s.sort_order ?? 0,
    })),
  }
}

export function useSupabaseContent() {
  const [content, setContent] = useState(FALLBACK_CONTENT)
  const [isLoading, setIsLoading] = useState(supabaseConfigured)
  const [source, setSource] = useState(supabaseConfigured ? 'loading' : 'fallback')

  useEffect(() => {
    if (!supabaseConfigured || !supabase) return
    let cancelled = false

    // The new tables (notices/offers/supplements) might not exist yet in the
    // user's database — wrap each read in a soft-fail so the rest still loads.
    const safe = (q) => q.then(r => r).catch(() => ({ data: [] }))

    Promise.all([
      supabase.from('site_settings').select('*').eq('id', 1).single(),
      supabase.from('hero_section').select('*').eq('id', 1).single(),
      supabase.from('membership_plans').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('services').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('gallery_items').select('*').order('sort_order').order('created_at'),
      supabase.from('team_members').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('reviews').select('*').eq('is_featured', true).order('sort_order'),
      safe(supabase.from('notices').select('*').eq('is_active', true).order('sort_order')),
      safe(supabase.from('offers').select('*').eq('is_active', true).order('sort_order')),
      safe(supabase.from('supplements').select('*').eq('is_active', true).order('sort_order')),
    ]).then(([settings, hero, plans, services, gallery, team, reviews, notices, offers, supplements]) => {
      if (cancelled) return
      setContent(mapToContent(
        settings.data,
        hero.data,
        plans.data,
        services.data,
        gallery.data,
        team.data,
        reviews.data,
        notices.data,
        offers.data,
        supplements.data,
      ))
      setSource('supabase')
    }).catch(() => {
      if (!cancelled) setSource('fallback')
    }).finally(() => {
      if (!cancelled) setIsLoading(false)
    })

    return () => { cancelled = true }
  }, [])

  return { content, isLoading, source }
}
