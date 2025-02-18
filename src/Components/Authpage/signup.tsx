import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import api from '../../Service/api';
import { useNavigate } from 'react-router-dom';

const signUpSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 8 characters'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
    const navigate = useNavigate();
  
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const mutation = useMutation({
    mutationFn: async (newUser: SignUpFormValues) => {
      const res = await api.post('/users', newUser);
      return res.data;
    },
    onSuccess: () => {
      navigate('/signin');
    }
  });

  const onSubmit = (data: SignUpFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto my-20 p-4">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('username')} placeholder="Username" className="border p-2 w-full mb-2" />
        {errors.username && <p className="text-red-500">{errors.username.message}</p>}
        
        <input {...register('email')} placeholder="Email" className="border p-2 w-full mb-2" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        
        <input {...register('password')} type="password" placeholder="Password" className="border p-2 w-full mb-2" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
