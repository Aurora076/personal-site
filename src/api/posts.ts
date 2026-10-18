/** 博客文章读写 */

import type { Post } from './types';
import { STORAGE_KEYS, delay, ensureSeeded, read, uid, write } from './storage';
import { seedPosts } from './seed';

export async function getPosts(): Promise<Post[]> {
  ensureSeeded();
  await delay();
  const list = read<Post[]>(STORAGE_KEYS.posts, seedPosts);
  // 按日期倒序
  return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const list = await getPosts();
  return list.find((item) => item.slug === slug) ?? null;
}

export async function savePost(post: Post): Promise<Post> {
  await delay();
  const list = read<Post[]>(STORAGE_KEYS.posts, seedPosts);
  const next = post.id ? post : { ...post, id: uid() };
  const index = list.findIndex((item) => item.id === next.id);

  if (index >= 0) list[index] = next;
  else list.unshift(next);

  write(STORAGE_KEYS.posts, list);
  return next;
}

export async function deletePost(id: string): Promise<void> {
  await delay();
  const list = read<Post[]>(STORAGE_KEYS.posts, seedPosts);
  write(STORAGE_KEYS.posts, list.filter((item) => item.id !== id));
}
