
import { getPosts } from "@/actions/blog-actions";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

export async function BlogSidebar() {
    // Fetch the latest 5 posts.
    const { posts } = await getPosts();
    const recentPosts = posts.slice(0, 5);

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Newspaper className="h-5 w-5 text-primary" />
                    <span>Últimas Noticias</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {recentPosts.map((post) => (
                        <li key={post.slug}>
                            <Link href={`/blog/${post.slug}`} className="font-medium text-muted-foreground hover:text-primary transition-colors">
                                {post.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
