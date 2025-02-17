import { useQuery } from '@tanstack/react-query';
import api from '../Service/api';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface Post {
  id: string;
  title: string;
  image: string;
  content: string;
  category: string;
}

const Travel = () => {
  const [page, setPage] = useState(1);
  const postsPerPage = 6;

 
  const { data: allPosts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['AllPosts'],
    queryFn: async () => {
      const res = await api.get('/blogwebsite');
      return res.data;
    }
  });

  const travelPosts = allPosts?.filter((post: Post) => post.category === 'food');


  const totalPages = Math.ceil((travelPosts?.length || 0) / postsPerPage);
  const paginatedPosts = travelPosts?.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  if (isLoading) return <p>Loading Food Posts...</p>;
  if (error) return <p>Error loading Food Posts: {error.message}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Food Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPosts?.map(post => (
          <Link to={`/post/${post.id}`} key={post.id}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-700">
                  {post.content.substring(0, 100)}...
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

     
      <div className="flex justify-center items-center mt-8 gap-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Travel;
