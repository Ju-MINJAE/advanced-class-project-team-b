import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import PostPagination from '@/components/PostPagination';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import usePostForm from '@/hooks/usePosts';

const POST_PER_PAGE = 6;

const PostSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-4 w-1/2" />
    </CardFooter>
  </Card>
);

const Posts = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { posts, meta, isLoading } = usePostForm(currentPage);
  const navigate = useNavigate();

  const createNewPost = () => {
    navigate('/new-post');
  };

  const pageCount = meta ? Math.ceil(meta.total / POST_PER_PAGE) : 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">커뮤니티 글 목록</h1>
        <Button onClick={createNewPost}>글 작성하기</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {isLoading
          ? Array.from({ length: POST_PER_PAGE }).map((_, index) => <PostSkeleton key={index} />)
          : posts.map(post => (
              <Card key={post.id} className="overflow-hidden">
                <Link to={`/posts/detail/${post.id}`}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReactMarkdown className="max-h-10 truncate">{post.content}</ReactMarkdown>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
                    <p>작성자: {post.accountUsername}</p>
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </CardFooter>
                </Link>
              </Card>
            ))}
      </div>

      {pageCount > 1 && (
        <PostPagination
          pageCount={pageCount}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Posts;
