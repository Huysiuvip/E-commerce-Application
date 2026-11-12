import axios from 'axios';
import { internalApi, internalSecret } from './internal-api';

interface SendAuthEmailPayload {
  to: string;
  name: string;
  url: string;
}

async function postAuthEmail(
  path: '/email/verification' | '/email/password-reset',
  payload: SendAuthEmailPayload,
): Promise<void> {
  const secret = internalSecret('auth email was Not sent');
  if (!secret) return;

  try {
    const res = await internalApi.post<{ success: boolean }>(path, payload, {
      headers: { 'X-Internal-Secret': secret },
    });
    if (res.data?.success !== true) {
      console.error(`[auth] Backend reported email delivery failure (${path})`);
    }
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    console.error(`[auth] Auth email request failed (${path}${status ? `, ${status}` : ''} )`);
  }
}

export async function sendVerificationEmail(
    to: string,
    name: string,
    url: string
): Promise<void> {
    await postAuthEmail('/email/verification', {to, name, url})
}
export async function sendPasswordResetEmail(
    to: string,
    name: string,
    url: string
): Promise<void> {
    await postAuthEmail('/email/password-reset', {to, name, url})
}
