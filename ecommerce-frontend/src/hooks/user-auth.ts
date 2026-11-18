import { authService } from '@/services/auth.services';
import { SignInDto, SignUpDto } from '@/types/api.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { error } from 'console';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type AuthToastMessage = {
  success?: string;
  error?: string;
};

export const useSignUp = (messages?: AuthToastMessage & { verifyEmail?: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignUpDto) => authService.signUp(data),
    onSuccess(response) {
      queryClient.setQueryData(['auth', 'session'], {
        user: response.user,
        isGuest: false,
        isAuthenticated: true,
      });
      if (response.token) {
        toast.success(messages?.success ?? 'Account created successfully!');
        router.push('/product/catalog');
        return;
      }
      toast.info(
        messages?.verifyEmail ??
          messages?.success ??
          'Account created! Please check your email to verify your account.',
      );
      router.push('/auth/signin');
    },

    onError: (error: unknown) => {
      const message = (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      )?.response?.data?.message;
      toast.error(typeof message === 'string' ? message : (messages?.error ?? 'Sign up failed'));
    },
  });
};

export const useResendVerificationEmail = (messages?: AuthToastMessage) => {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerificationEmail(email),

    onSuccess() {
      toast.success(messages?.success ?? 'Verification email sent! Please check your inbox');
    },

    onError: (error: unknown) => {
      const message = (
        error as {
          response?: { data?: { message?: string } };
        }
      )?.response?.data?.message;
      toast.error(
        typeof message === 'string'
          ? message
          : (messages?.error ?? 'Failed to send verification Email'),
      );
    },
  });
};

export const useSignIn = (messages?: AuthToastMessage, redirectTo?: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInDto & { rememberMe?: boolean }) => authService.signIn(data),

    onSuccess: (response) => {
      queryClient.setQueryData(['auth', 'session'], {
        user: response.user,
        isGuest: false,
        isAuthenticated: true,
      });
      toast.success(messages?.success ?? 'SignIn successful!');
      router.push(redirectTo ?? '/product/catalog');
    },

    onError: (error: unknown) => {
      const message = (
        error as {
          response?: { data?: { messages?: string } };
        }
      )?.response?.data?.messages;

      toast.error(typeof message === 'string' ? message : (messages?.error ?? 'SignIn failed'));
    },
  });
};
