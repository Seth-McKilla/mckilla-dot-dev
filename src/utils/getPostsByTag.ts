import { slugifyAll } from './slugify';
import type { MarkdownInstance } from 'astro';
import type { Frontmatter } from '../types';
import { isDev } from './environment';

const getPostsByTag = (posts: MarkdownInstance<Frontmatter>[], tag: string) =>
  posts.filter(
    (post) =>
      (isDev || !post.frontmatter.draft) &&
      slugifyAll(post.frontmatter.tags).includes(tag)
  );

export default getPostsByTag;
