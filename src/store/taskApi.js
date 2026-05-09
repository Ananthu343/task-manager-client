import { apiSlice } from './apiSlice';
import { io } from 'socket.io-client';

export const taskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => '/tasks',
      providesTags: ['Task'],
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }) {
        const token = getState().auth.token;
        if (!token) return;

        // Initialize Socket connection
        const socket = io('http://localhost:8000', {
          auth: { token }
        });

        try {
          await cacheDataLoaded;

          socket.on('task_created', (task) => {
            updateCachedData((draft) => {
              if (draft?.data?.tasks) {
                draft.data.tasks.unshift(task);
              }
            });
          });

          socket.on('task_updated', (updatedTask) => {
            updateCachedData((draft) => {
              if (draft?.data?.tasks) {
                const index = draft.data.tasks.findIndex(t => t.id === updatedTask.id);
                if (index !== -1) {
                  draft.data.tasks[index] = updatedTask;
                }
              }
            });
          });

          socket.on('task_deleted', ({ id }) => {
            updateCachedData((draft) => {
              if (draft?.data?.tasks) {
                draft.data.tasks = draft.data.tasks.filter(t => t.id !== id);
              }
            });
          });
        } catch {
          // no-op in case cacheDataLoaded rejects
        }

        await cacheEntryRemoved;
        socket.disconnect();
      }
    }),
    createTask: builder.mutation({
      query: (newTask) => ({
        url: '/tasks',
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = taskApi;