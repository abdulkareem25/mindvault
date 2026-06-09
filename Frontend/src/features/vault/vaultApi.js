import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../shared/services/baseQueryWithReauth';

export const vaultApi = createApi({
  reducerPath: 'vaultApi',
  baseQuery: baseQueryWithReauth,
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
    searchMemories: builder.query({
      query: ({ q, category, type, isArchived } = {}) => {
        const isSemantic = import.meta.env.VITE_ENABLE_SEMANTIC_SEARCH === 'true';
        const basePath = isSemantic ? '/memories/semantic' : '/memories/search';
        
        const params = new URLSearchParams();
        if (q) params.append('q', q);
        if (category && category !== 'all') params.append('category', category);
        if (type && type !== 'all') params.append('type', type);
        if (isArchived !== undefined) params.append('isArchived', isArchived);
        
        const queryString = params.toString();
        return `${basePath}${queryString ? `?${queryString}` : ''}`;
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
      async onQueryStarted({ id, ...fields }, { dispatch, queryFulfilled, getState }) {
        const state = getState();
        const activeFilters = state.vault?.activeFilters || { category: 'all', type: 'all', isArchived: false };
        const searchQuery = state.vault?.searchQuery || '';

        const patches = [];

        // Optimistic update for getMemories
        const getMemoriesArgs = {
          category: activeFilters.category,
          type: activeFilters.type,
          isArchived: activeFilters.isArchived,
        };

        const getMemoriesPatch = dispatch(
          vaultApi.util.updateQueryData('getMemories', getMemoriesArgs, (draft) => {
            if (draft && draft.memories) {
              const memory = draft.memories.find((m) => m._id === id);
              if (memory) {
                Object.assign(memory, fields);
              }
            }
          })
        );
        patches.push(getMemoriesPatch);

        // Optimistic update for searchMemories
        if (searchQuery) {
          const searchMemoriesArgs = {
            q: searchQuery,
            category: activeFilters.category,
            type: activeFilters.type,
            isArchived: activeFilters.isArchived,
          };
          const searchMemoriesPatch = dispatch(
            vaultApi.util.updateQueryData('searchMemories', searchMemoriesArgs, (draft) => {
              if (draft) {
                const memory = draft.find((m) => m._id === id);
                if (memory) {
                  Object.assign(memory, fields);
                }
              }
            })
          );
          patches.push(searchMemoriesPatch);
        }

        try {
          await queryFulfilled;
        } catch {
          // Rollback patches if failed
          patches.forEach((patch) => patch.undo());
        }
      },
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
  useSearchMemoriesQuery,
  useCreateMemoryMutation,
  useUpdateMemoryMutation,
  useDeleteMemoryMutation,
  useToggleArchiveMutation,
  useGetStatsQuery,
} = vaultApi;

export default vaultApi;
