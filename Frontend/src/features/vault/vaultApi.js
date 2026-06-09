import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../constants';

export const vaultApi = createApi({
  reducerPath: 'vaultApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // In-memory token storage pattern is implemented in Ticket-002
      const token = getState().auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Memory', 'Stats'],
  endpoints: (builder) => ({
    getMemories: builder.query({
      query: ({ category, type, isArchived, page, limit } = {}) => {
        const params = new URLSearchParams();
        if (category && category !== 'all') params.append('category', category);
        if (type && type !== 'all') params.append('type', type);
        if (isArchived !== undefined) params.append('isArchived', isArchived);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        
        const queryString = params.toString();
        return `/memories${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Memory'],
    }),
    createMemory: builder.mutation({
      query: (memoryData) => ({
        url: '/memories/capture',
        method: 'POST',
        body: memoryData,
      }),
      invalidatesTags: ['Memory', 'Stats'],
    }),
    updateMemory: builder.mutation({
      query: ({ id, ...fields }) => ({
        url: `/memories/${id}`,
        method: 'PATCH',
        body: fields,
      }),
      invalidatesTags: ['Memory', 'Stats'],
    }),
    deleteMemory: builder.mutation({
      query: ({ id, confirm }) => ({
        url: `/memories/${id}`,
        method: 'DELETE',
        body: { confirm },
      }),
      invalidatesTags: ['Memory', 'Stats'],
    }),
    toggleArchive: builder.mutation({
      query: (id) => ({
        url: `/memories/${id}/archive`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Memory', 'Stats'],
    }),
    getStats: builder.query({
      query: () => '/memories/stats',
      providesTags: ['Stats'],
    }),
  }),
});

export const {
  useGetMemoriesQuery,
  useCreateMemoryMutation,
  useUpdateMemoryMutation,
  useDeleteMemoryMutation,
  useToggleArchiveMutation,
  useGetStatsQuery,
} = vaultApi;

export default vaultApi;
