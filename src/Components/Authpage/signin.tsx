
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import api from '../../Service/api';
import { useDispatch } from 'react-redux';
import { signIn } from '../../Redux/Slices/authslice';
import { useNavigate } from 'react-router-dom';

const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: SignInFormValues) => {
      const res = await api.get('/users', {
        params: {
          email: data.email,
          password: data.password,
        }
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.length > 0) {
        const user = data[0];
        dispatch(signIn({ userId: user.id, username: user.username, email: user.email }));
        navigate('/profile');
      } else {
        alert('Invalid email or password');
      }
    }
  });

  const onSubmit = (data: SignInFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email')} placeholder="Email" className="border p-2 w-full mb-2" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        
        <input {...register('password')} type="password" placeholder="Password" className="border p-2 w-full mb-2" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
