import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../constants';
import { setToken, clearAuth } from '../../features/auth/auth.slice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Prevent infinite loop if the refresh token call itself fails with 401
    const url = typeof args === 'string' ? args : args.url;
    if (url !== '/auth/refresh') {
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
        },
        api,
        extraOptions
      );

      if (refreshResult.data && refreshResult.data.accessToken) {
        const { accessToken } = refreshResult.data;
        api.dispatch(setToken(accessToken));
        
        // Retry the original query with the new token
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearAuth());
      }
    }
  }

  return result;
};
