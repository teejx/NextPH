import { Article } from './types';

/**
 * DEVELOPMENT FIXTURES ONLY
 * 
 * Notice: These articles are clearly identified sample content designed for development,
 * testing, and UI preview when the WordPress REST API is unreachable.
 * They must NOT be presented as real news in production.
 */
export const SAMPLE_FIXTURES: Article[] = [
  {
    id: 'sample-1',
    slug: 'future-of-fintech-philippines-cashless-economy',
    title: '[Sample] How Open Finance and Digital Wallets Are Reshaping the Philippine Economy',
    excerpt: 'An in-depth editorial look into how interoperable QR codes, open finance regulations, and mobile money adoption are accelerating financial inclusion across 7,000 islands.',
    contentHtml: `
      <p class="lead">From bustling markets in Quiapo to sari-sari stores in Siargao, digital wallets and national QR Ph standards have quietly sparked a payments revolution across the Philippine archipelago.</p>
      <p>Over the last three years, mobile banking transactions have grown exponentially, driven by regulatory sandboxes fostered by the Bangko Sentral ng Pilipinas (BSP) and aggressive technology investments by regional fintech challengers.</p>
      <h2>The Shift Toward Interoperable Open Finance</h2>
      <p>Historically, banked penetration in rural provinces remained constrained by geographical fragmentation and legacy branch economics. Today, cloud-native platforms, lightweight API gateways, and standardized identity verification are dissolving those barriers.</p>
      <blockquote>"Financial inclusion is not merely about possessing a digital account; it is about providing dignified access to credit, insurance, and long-term wealth creation."</blockquote>
      <p>As the country transitions toward a digital-first economy, the remaining hurdle is strengthening cybersecurity hygiene and resilient offline fallback channels for remote communities during extreme weather events.</p>
    `,
    publishedAt: '2026-10-15T09:00:00Z',
    updatedAt: '2026-10-15T11:30:00Z',
    readingTimeMinutes: 5,
    category: {
      id: 101,
      name: 'Tech',
      slug: 'tech',
    },
    tags: [
      { id: 201, name: 'Fintech', slug: 'fintech' },
      { id: 202, name: 'Open Finance', slug: 'open-finance' },
      { id: 203, name: 'Digital Economy', slug: 'digital-economy' },
    ],
    author: {
      id: 1,
      name: 'Gabriel Morales',
      slug: 'gabriel-morales',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      bio: 'Senior Technology Editor covering emerging Southeast Asian platforms and telecommunications infrastructure.',
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80',
      alt: 'Digital mobile banking screen interface with illuminated cityscape background',
      width: 1600,
      height: 1067,
    },
    isFeatured: true,
    isTrending: true,
    videoEmbedUrl: null,
  },
  {
    id: 'sample-2',
    slug: 'batanes-responsible-ecotourism-preservation',
    title: '[Sample] Preserving Ivatan Heritage: The Quiet Architecture of Sustainable Travel in Batanes',
    excerpt: 'How ancestral stone masonry, traditional cooperative fishing, and disciplined community visitor limits protect the northernmost frontier of the Philippines.',
    contentHtml: `
      <p class="lead">Perched along the windswept ridges of Basco, the traditional Ivatan stone houses stand as masterclasses in climate resilience, designed centuries ago to withstand the fiercest Pacific typhoons.</p>
      <p>Unlike rapid resort developments elsewhere in the Pacific rim, Batanes has intentionally chosen community-managed carrying capacities, ensuring that tourism directly sustains local heritage artisans rather than displacing them.</p>
      <h2>Ancestral Engineering and Living Culture</h2>
      <p>The thick limestone and coral walls, bound by lime mortar and thatched with dense cogon grass, require communal maintenance known as <em>yaru</em>—a living testament to indigenous bayanihan spirit.</p>
    `,
    publishedAt: '2026-10-14T14:20:00Z',
    updatedAt: '2026-10-14T14:20:00Z',
    readingTimeMinutes: 6,
    category: {
      id: 102,
      name: 'Travel',
      slug: 'travel',
    },
    tags: [
      { id: 204, name: 'Batanes', slug: 'batanes' },
      { id: 205, name: 'Ecotourism', slug: 'ecotourism' },
      { id: 206, name: 'Heritage', slug: 'heritage' },
    ],
    author: {
      id: 2,
      name: 'Sofia Reyes',
      slug: 'sofia-reyes',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
      bio: 'Travel journalist and documentary photographer focusing on indigenous architecture and environmental preservation.',
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      alt: 'Rolling green coastal hills meeting dramatic ocean cliffs under soft morning clouds',
      width: 1600,
      height: 1067,
    },
    isFeatured: false,
    isTrending: true,
    videoEmbedUrl: null,
  },
  {
    id: 'sample-3',
    slug: 'modern-filipino-culinary-renaissance',
    title: '[Sample] Reimagining the Archipelagic Larder: Inside Manila’s Modern Culinary Movement',
    excerpt: 'Contemporary Filipino chefs are delving into indigenous vinegar fermentation, heirloom barako beans, and forest-foraged ingredients to craft a bold new culinary lexicon.',
    contentHtml: `
      <p class="lead">Far beyond comforting stews and festive street skewers, a new wave of Manila kitchens is treating indigenous fermentations and heritage produce as serious culinary science.</p>
      <p>From single-origin tablea chocolate in Davao to wild batuan sours from Negros Occidental, dining rooms are celebrating regional terroir with unhurried craft.</p>
    `,
    publishedAt: '2026-10-13T10:15:00Z',
    updatedAt: '2026-10-13T10:15:00Z',
    readingTimeMinutes: 4,
    category: {
      id: 103,
      name: 'Lifestyle',
      slug: 'lifestyle',
    },
    tags: [
      { id: 207, name: 'Culinary', slug: 'culinary' },
      { id: 208, name: 'Food Culture', slug: 'food-culture' },
      { id: 209, name: 'Gastronomy', slug: 'gastronomy' },
    ],
    author: {
      id: 3,
      name: 'Marco Chen',
      slug: 'marco-chen',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      bio: 'Culture critic and lifestyle essayist documenting culinary evolution across Asia-Pacific.',
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80',
      alt: 'Artisanal modern plated dish featuring regional Filipino heritage ingredients',
      width: 1600,
      height: 1067,
    },
    isFeatured: false,
    isTrending: false,
    videoEmbedUrl: null,
  },
  {
    id: 'sample-4',
    slug: 'philippine-space-agency-coastal-monitoring-satellites',
    title: '[Sample] Eyes on the Coastline: How PhilSA Satellite Imagery Protects Marine Habitats',
    excerpt: 'How spaceborne remote sensing, multi-spectral imaging, and local universities track coral bleaching, mangrove regeneration, and illegal maritime incursions.',
    contentHtml: `
      <p class="lead">Operating from the heart of Quezon City, engineers at the Philippine Space Agency (PhilSA) analyze high-resolution satellite passes each dawn to safeguard the country's marine biodiversity.</p>
      <p>Through the Diwata and Maya satellite programs, homegrown telemetry enables disaster management councils and marine scientists to react swiftly to climate threats.</p>
    `,
    publishedAt: '2026-10-12T16:00:00Z',
    updatedAt: '2026-10-12T16:00:00Z',
    readingTimeMinutes: 5,
    category: {
      id: 101,
      name: 'Tech',
      slug: 'tech',
    },
    tags: [
      { id: 210, name: 'Space Science', slug: 'space-science' },
      { id: 211, name: 'Marine Biology', slug: 'marine-biology' },
      { id: 212, name: 'Innovation', slug: 'innovation' },
    ],
    author: {
      id: 1,
      name: 'Gabriel Morales',
      slug: 'gabriel-morales',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      bio: 'Senior Technology Editor covering emerging Southeast Asian platforms and telecommunications infrastructure.',
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
      alt: 'Luminous earth satellite view showing archipelagic coastal outlines and deep oceans',
      width: 1600,
      height: 1067,
    },
    isFeatured: false,
    isTrending: true,
    videoEmbedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 'sample-5',
    slug: 'coffee-culture-cordillera-single-origin',
    title: '[Sample] High-Altitude Harvest: The Resurgence of Benguet Arabica',
    excerpt: 'Smallholder indigenous farmers in the Cordillera highlands are partnering with specialty roasters, elevating Philippine single-origin beans onto the world stage.',
    contentHtml: `
      <p class="lead">Under the cool pine-shaded canopies of Atok and Kibungan, coffee cherries ripen slowly at elevations surpassing 1,500 meters above sea level.</p>
      <p>Pioneering farm collectives have embraced meticulous anaerobic natural processing and raised drying beds, fetching record prices at international auctions.</p>
    `,
    publishedAt: '2026-10-11T08:30:00Z',
    updatedAt: '2026-10-11T08:30:00Z',
    readingTimeMinutes: 4,
    category: {
      id: 103,
      name: 'Lifestyle',
      slug: 'lifestyle',
    },
    tags: [
      { id: 213, name: 'Coffee', slug: 'coffee' },
      { id: 214, name: 'Cordillera', slug: 'cordillera' },
      { id: 215, name: 'Agriculture', slug: 'agriculture' },
    ],
    author: {
      id: 3,
      name: 'Marco Chen',
      slug: 'marco-chen',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      bio: 'Culture critic and lifestyle essayist documenting culinary evolution across Asia-Pacific.',
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80',
      alt: 'Fresh artisanal coffee pour-over on a warm wooden tabletop with coffee beans',
      width: 1600,
      height: 1067,
    },
    isFeatured: false,
    isTrending: false,
    videoEmbedUrl: null,
  },
  {
    id: 'sample-6',
    slug: 'palawan-underground-river-conservation-protocols',
    title: '[Sample] Deep into Puerto Princesa: Balancing Visitor Influx with Cave Biosphere Ecology',
    excerpt: 'Inside the subterranean karst chambers of Palawan, strict acoustic protocols and zero-emission boat engines ensure bat colonies and rare swiftlets thrive.',
    contentHtml: `
      <p class="lead">Entering the cave entrance of St. Paul Subterranean River National Park, visitors are greeted not by echoing megaphones, but by serene, silent waters.</p>
      <p>Park rangers utilize solar-charged whisper motors and infrared monitoring to prevent light pollution from disrupting delicate cave micro-fauna.</p>
    `,
    publishedAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z',
    readingTimeMinutes: 5,
    category: {
      id: 102,
      name: 'Travel',
      slug: 'travel',
    },
    tags: [
      { id: 216, name: 'Palawan', slug: 'palawan' },
      { id: 205, name: 'Ecotourism', slug: 'ecotourism' },
      { id: 217, name: 'Conservation', slug: 'conservation' },
    ],
    author: {
      id: 2,
      name: 'Sofia Reyes',
      slug: 'sofia-reyes',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
      bio: 'Travel journalist and documentary photographer focusing on indigenous architecture and environmental preservation.',
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1600&q=80',
      alt: 'Emerald limestone lagoon with clear turquoise water and towering karst rocks',
      width: 1600,
      height: 1067,
    },
    isFeatured: false,
    isTrending: true,
    videoEmbedUrl: null,
  },
];
