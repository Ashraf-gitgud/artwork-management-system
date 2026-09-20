import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials({ token: res.token, user: res.user }));
      navigate('/dashboard');
    } catch {
      // handled by error state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-navy-900">Art Gallery Admin</h1>
          <p className="text-sm text-navy-500 mt-1">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Username"
            required
            {...register('username', { required: 'Username is required' })}
            error={errors.username?.message}
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            required
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message}
            autoComplete="current-password"
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
              {error?.data?.message || 'Invalid username or password'}
            </p>
          )}

          <Button type="submit" loading={isLoading} className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}