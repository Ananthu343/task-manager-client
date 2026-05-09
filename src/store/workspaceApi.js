import { apiSlice } from './apiSlice';

export const workspaceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaces: builder.query({
      query: () => '/workspaces',
      providesTags: ['Workspace'],
    }),
    createWorkspace: builder.mutation({
      query: (newWorkspace) => ({
        url: '/workspaces',
        method: 'POST',
        body: newWorkspace,
      }),
      invalidatesTags: ['Workspace'],
    }),
    updateWorkspace: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/workspaces/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Workspace'],
    }),
    deleteWorkspace: builder.mutation({
      query: (id) => ({
        url: `/workspaces/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Workspace'],
    }),
  }),
});

export const { 
    useGetWorkspacesQuery, 
    useCreateWorkspaceMutation,
    useUpdateWorkspaceMutation,
    useDeleteWorkspaceMutation
} = workspaceApi;