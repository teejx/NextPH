import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Laptop, Shirt, Plane, Newspaper, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'TECH',
    slug: 'tech',
    icon: Laptop,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    alt: 'Laptop and workspace keyboard',
  },
  {
    name: 'LIFESTYLE',
    slug: 'lifestyle',
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    alt: 'Minimalist clothing rack wardrobe',
  },
  {
    name: 'TRAVEL',
    slug: 'travel',
    icon: Plane,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    alt: 'Airplane wing over sunlit clouds',
  },
  {
    name: 'TRENDING',
    slug: 'trending',
    icon: Newspaper,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    alt: 'City skyline and contemporary architecture',
  },
];

export const CategoryStrip: React.FC = () => {
  return (
    <section className="py-6" aria-label="Category Navigation">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group relative h-36 sm:h-44 overflow-hidden rounded-xs bg-zinc-950 flex flex-col items-center justify-center text-center p-4 shadow-xs"
            >
              {/* Background Photographic Image with Dark Vignette */}
              <Image
                src={cat.image}
                alt={cat.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover opacity-40 transition-transform duration-700 ease-out group-hover:scale-108 group-hover:opacity-50"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

              {/* Content: Icon, Title, Arrow */}
              <div className="relative z-10 flex flex-col items-center gap-2 text-white">
                <Icon className="h-7 w-7 text-white stroke-[1.5] transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span className="font-sans text-xs sm:text-sm font-black tracking-widest uppercase">
                  {cat.name}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-300 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
