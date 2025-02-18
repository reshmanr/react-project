import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../Service/api';

const createPostSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  image: z.string().url("Must be a valid URL"),
  category: z.string().min(1, "Category is required"),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;


interface Post {
  id: string;
  title: string;
  image: string;
  content: string;
  likes: number;
  bookmarks: number;
  comments: string[];
  category: string;
  author: string;
  date: string;
  latest: boolean;
  popular: boolean;
}

const CreatePost = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { username } = useSelector((state: any) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: CreatePostFormValues) => {
      const postData: Partial<Post> = {
        ...data,
        author: username,
        date: new Date().toLocaleDateString(),
        likes: 0,
        bookmarks: 0,
        comments: [],
        latest: true, 
        popular: false, 
      };
      const res = await api.post('/blogwebsite', postData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latestPosts'] });
      navigate('/');
    },
  });

  const onSubmit = (data: CreatePostFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create a New Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            {...register("title")}
            className="w-full border p-2 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold mb-1">Content</label>
          <textarea
            {...register("content")}
            className="w-full border p-2 rounded"
            rows={6}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold mb-1">Image URL</label>
          <input
            type="text"
            {...register("image")}
            className="w-full border p-2 rounded"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select {...register("category")} className="w-full border p-2 rounded">
            <option value="">Select Category</option>
            <option value="travel">Travel</option>
            <option value="food">Food</option>
            <option value="tech">Tech</option>
            <option value="diy">DIY</option>
            <option value="lifestyle">Lifestyle</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;