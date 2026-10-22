import type { PageId } from '../types/navigation';

export const PAGE_PATHS: Record<PageId, string> = {
  home: '/',
  about: '/about-us',
  team: '/our-team',
  'before-after': '/before-after',
  treatments: '/treatments',
  gallery: '/gallery',
  blog: '/blog',
  contact: '/contact-us',
  privacy: '/privacy-policy',
  admin: '/admin'
};

export const getPageFromPath = (path: string): PageId => {
  const match = Object.entries(PAGE_PATHS).find(([, routePath]) => routePath === path);
  return (match?.[0] as PageId | undefined) ?? 'home';
};
