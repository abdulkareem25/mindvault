import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../shared/services/baseQueryWithReauth';

export const digestApi = createApi({
  reducerPath: 'digestApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Digest'],
  endpoints: (builder) => ({
    getLatestDigest: builder.query({
      query: () => '/digest/latest',
      providesTags: ['Digest'],
    }),
    dismissDigest: builder.mutation({
      query: (id) => ({
        url: `/digest/${id}/dismiss`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Digest'],
    }),
    getAllDigests: builder.query({
      query: () => '/digest',
      providesTags: ['Digest'],
    }),
  }),
});

export const {
  useGetLatestDigestQuery,
  useDismissDigestMutation,
  useGetAllDigestsQuery,
} = digestApi;

export default digestApi;
