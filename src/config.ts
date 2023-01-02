import type { SocialObjects } from './types';

export const SITE = {
  website: 'https://mckilla.dev/',
  author: 'Seth McCullough',
  desc: 'The musings of a full stack Typescript developer with a passion for SaaS.',
  title: 'mckilla.dev',
  ogImage: 'astropaper-og.jpg',
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/sethmckilla',
    linkTitle: `${SITE.title} on Twitter`,
    active: true,
  },
  {
    name: 'Github',
    href: 'https://github.com/Seth-McKilla',
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: 'Mail',
    href: 'mailto:seth@mckilla.dev',
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/',
    linkTitle: `${SITE.title} on YouTube`,
    active: false,
  },
];
