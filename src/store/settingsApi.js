import { apiSlice } from './apiSlice';

export const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation({
      query: (settings) => ({
        url: '/settings',
        method: 'PATCH',
        body: settings,
      }),
      invalidatesTags: ['Settings'],
    }),
    getWebhooks: builder.query({
      query: () => '/webhooks',
      providesTags: ['Webhook'],
    }),
    createWebhook: builder.mutation({
      query: (newWebhook) => ({
        url: '/webhooks',
        method: 'POST',
        body: newWebhook,
      }),
      invalidatesTags: ['Webhook'],
    }),
    deleteWebhook: builder.mutation({
      query: (id) => ({
        url: `/webhooks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Webhook'],
    }),
  }),
});

export const { 
    useGetSettingsQuery, 
    useUpdateSettingsMutation, 
    useGetWebhooksQuery, 
    useCreateWebhookMutation, 
    useDeleteWebhookMutation 
} = settingsApi;
