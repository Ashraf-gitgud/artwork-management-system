import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  useGetMeQuery,
  useUpdateUserMutation,
} from '../../features/auth/authApi';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

export default function Profile() {
  const authUser = useSelector((s) => s.auth.user);
  const { data: me, isLoading } = useGetMeQuery();
  const [updateUser, { isLoading: saving, isSuccess }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (me) {
      reset({
        firstName: me.firstName || '',
        lastName: me.lastName || '',
        username: me.username || '',
      });
    }
  }, [me, reset]);

  const onSubmit = async (data) => {
    const id = me?._id || me?.id || authUser?.id;
    if (!id) return;
    try {
      await updateUser({ id, ...data }).unwrap();
    } catch {
      // ignore
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-lg mx-auto">
      <Card title="My Profile">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="First Name"
            required
            {...register('firstName', { required: 'Required' })}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            required
            {...register('lastName', { required: 'Required' })}
            error={errors.lastName?.message}
          />
          <Input
            label="Username"
            required
            {...register('username', { required: 'Required' })}
            error={errors.username?.message}
          />

          {isSuccess && (
            <p className="text-sm text-emerald-600">Profile updated successfully.</p>
          )}

          <div className="pt-2">
            <Button type="submit" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}