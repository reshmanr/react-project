import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../Service/api';


interface Post {
  id: string;
  title: string;
  image: string;
  content: string;
  likes: string;
  bookmarks: number;
  comments: string[];
}

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await api.get(`/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  if (isLoading) return <p>Loading post...</p>;
  if (error) return <p>Error loading post.</p>;
  if (!post) return <p>No post found.</p>; 

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>
      <img
        src={post?.image}
        alt={post?.title}
        className="w-full h-96 object-cover rounded-lg mb-4"
      />
      <p className="text-lg mb-4">{post?.content}</p>
      <div className="flex items-center gap-4 text-gray-600">
        <span>{post?.likes} Likes</span>
        <span>{post?.bookmarks} Bookmarks</span>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {post?.comments?.length > 0 ? (
          <ul className="space-y-4">
            {post.comments.map((comment, index) => (
              <li
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <p>{comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
