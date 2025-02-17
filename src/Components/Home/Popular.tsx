import { useQuery } from '@tanstack/react-query';
import api from '../../Service/api'
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  image: string;
}

const PopularPosts = () => {
  const { data: popularPosts, isLoading,error  } = useQuery<Post[]>({
    queryKey: ['PopularPosts'],
    queryFn: async () => {
      const res = await api.get('/blogwebsite?popular=true');
      console.log('API Response:', res.data); 
      return res.data;
    },
  });

  if (isLoading) return <p>Loading Popular Posts...</p>;
  if (error) return <p>Error loading Popular posts: {error.message}</p>;

  return (
    <div className='m-11'>
      <h2 className="text-4xl font-mono font-bold my-8 ">Popular Posts</h2>
      <div className="grid md:grid-cols-3 gap-15">
        {popularPosts?.map((post: Post) => (
          <Link to={`/post/${post.id}`} key={post.id}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-t-lg" />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{post.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;
