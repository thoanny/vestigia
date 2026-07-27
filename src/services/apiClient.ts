import { API_BASE_URL } from '@/config';
import { authService } from '@/services/authService';

interface RequestOptions extends RequestInit {
  _retry?: boolean;
}

async function request(path: string, options: RequestOptions = {}): Promise<Response> {
  const token = await authService.getToken();

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (response.status === 401 && !options._retry) {
    try {
      const newToken = await authService.refresh();
      const retryHeaders = new Headers(options.headers);
      retryHeaders.set('Content-Type', 'application/json');
      retryHeaders.set('Authorization', `Bearer ${newToken}`);

      return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: retryHeaders,
        _retry: true,
      } as RequestOptions);
    } catch {
      await authService.logout();
      throw new Error('Session expirée');
    }
  }

  return response;
}

export const apiClient = {
  get: (path: string) => request(path, { method: 'GET' }),
  post: (path: string, body?: unknown) =>
    request(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: (path: string, body?: unknown) =>
    request(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: (path: string) => request(path, { method: 'DELETE' }),
};
