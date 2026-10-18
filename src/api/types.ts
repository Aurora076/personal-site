/**
 * 全站共享的数据类型定义。
 * 组件与 API 层都必须使用这里的类型,保证前后台数据结构一致。
 */

export interface SocialLink {
  label: string;
  url: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  period: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  avatar: string;
  bio: string;
  email: string;
  location: string;
  socials: SocialLink[];
  experiences: Experience[];
  education: Education[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  content: string;
  cover?: string;
  tags: string[];
  link?: string;
  repo?: string;
  date: string;
  featured: boolean;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  cover?: string;
  date: string;
  published: boolean;
}

export interface SiteSettings {
  siteTitle: string;
  accentColor: string;
  footerText: string;
  showStarfield: boolean;
}

/** 通用 API 返回结果 */
export interface ApiResult {
  ok: boolean;
  error?: string;
}
