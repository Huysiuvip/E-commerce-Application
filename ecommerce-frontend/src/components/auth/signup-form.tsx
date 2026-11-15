'use client';
import { useSignUp } from '@/hooks/user-auth';
import { SignUpDto } from '@/types/api.type';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo } from 'react';
import * as z from 'zod';
import { Card, CardContent } from '../ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '../ui/field';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type SignUpFormValues = SignUpDto & { confirmPassword: string };

const SignUpForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const signUpMutation = useSignUp({
    success: 'Tạo tài khoản thành công!',
    verifyEmail: 'Tạo tài khoản thành công! Vui lòng kiểm tra email để xác minh.',
    error: 'Đăng ký thất bại',
  });
  const signUpSchema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
          email: z.string().email('Email không hợp lệ'),
          password: z
            .string()
            .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
            .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất một chữ hoa')
            .regex(/[0-9]/, 'Mật khẩu phải có ít nhất một chữ số'),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: 'Mật khẩu không khớp',
          path: ['confirmPassword'],
        }),
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const { email, password, name } = data;
    await signUpMutation.mutateAsync({ email, password, name });
  };

  return (
    <div
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
                <p className="text-muted-foreground text-balance">
                  Nhập thông tin của bạn để bắt đầu
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="name">Họ và tên</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  {...register('name')}
                  disabled={signUpMutation.isPending}
                />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register('email')}
                  disabled={signUpMutation.isPending}
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  disabled={signUpMutation.isPending}
                />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">Xác nhận mật khẩu</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  disabled={signUpMutation.isPending}
                />
                {errors.confirmPassword && (
                  <FieldError>{errors.confirmPassword.message}</FieldError>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={signUpMutation.isPending}
                >
                  {signUpMutation.isPending ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Đã có tài khoản?{' '}
                <a
                  href="/auth/signin"
                  className="font-medium text-primary hover:underline"
                >
                  Đăng nhập
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default SignUpForm;
