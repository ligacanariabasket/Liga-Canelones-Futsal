import { getPosts } from '@/actions/blog-actions';
import { LatestNewsBanner } from './LatestNewsBanner';

export async function LatestNewsBannerData() {
  const postsData = await getPosts();
  return <LatestNewsBanner posts={postsData.posts} />;
}
