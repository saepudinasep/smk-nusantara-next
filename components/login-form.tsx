'use client';

import { useState } from 'react';
import { cn } from 'cn';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

import { useAuth } from '@/contexts/auth-context';
import { ROLE_HOME_PATH, ROLE_LABEL } from '@/lib/dummy-users';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Username dan password wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    // Simulasi jeda proses login supaya terasa nyata
    setTimeout(() => {
      const result = login(username, password);

      if (!result.success) {
        setIsSubmitting(false);
        setError(result.message);
        toast.error('Login gagal', { description: result.message });
        return;
      }

      toast.success(`Selamat datang, ${result.user.name}`, {
        description: `Masuk sebagai ${ROLE_LABEL[result.user.role]}`,
      });
      router.push(ROLE_HOME_PATH[result.user.role]);
      router.refresh();
    }, 400);
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form className='p-6 md:p-8' onSubmit={handleSubmit}>
            <FieldGroup>
              <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-2xl font-bold'>SMK Nusantara</h1>
                <p className='text-balance text-muted-foreground'>
                  Login untuk mengakses halaman lain.
                </p>
              </div>
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor='username'>Username</FieldLabel>
                <Input
                  id='username'
                  type='text'
                  placeholder='smknusantara'
                  autoComplete='username'
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  aria-invalid={!!error}
                  required
                />
              </Field>
              <Field data-invalid={!!error}>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                </div>
                <Input
                  id='password'
                  type='password'
                  autoComplete='current-password'
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={!!error}
                  required
                />
                <FieldError errors={error ? [{ message: error }] : undefined} />
              </Field>
              <Field>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Memproses...' : 'Login'}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className='relative hidden bg-muted md:block'>
            <Image
              fill
              src='/assets/images/login.jpeg'
              alt='Image'
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
