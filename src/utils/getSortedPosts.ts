import type { MarkdownInstance } from 'astro';
import type { Frontmatter } from '../types';
import { isDev } from './environment';

const getSortedPosts = (posts: MarkdownInstance<Frontmatter>[]) =>
  posts
    .filter(({ frontmatter }) => isDev || !frontmatter.draft)
    .sort(
      (a, b) =>
        Math.floor(new Date(b.frontmatter.datetime).getTime() / 1000) -
        Math.floor(new Date(a.frontmatter.datetime).getTime() / 1000)
    );

export default getSortedPosts;
