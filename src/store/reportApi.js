import { apiSlice } from './apiSlice';
import { io } from 'socket.io-client';

export const reportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReportHistory: builder.query({
      query: () => '/reports/history',
      providesTags: ['Report'],
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }) {
        const token = getState().auth.token;
        if (!token) return;

        const socket = io('https://task-manager.in/api', {
          auth: { token }
        });

        try {
          await cacheDataLoaded;

          socket.on('report_progress', (updatedReport) => {
            updateCachedData((draft) => {
              if (draft?.data?.reports) {
                const index = draft.data.reports.findIndex(r => r.id === updatedReport.id);
                if (index !== -1) {
                  draft.data.reports[index] = { ...draft.data.reports[index], ...updatedReport };
                } else {
                  draft.data.reports.unshift(updatedReport);
                }
              }
            });
          });

        } catch {
          // no-op
        }

        await cacheEntryRemoved;
        socket.disconnect();
      }
    }),
    generateReport: builder.mutation({
      query: (data) => ({
        url: '/reports/generate',
        method: 'POST',
        body: data, 
      }),
      invalidatesTags: ['Report'],
    }),
  }),
});

export const { 
    useGetReportHistoryQuery, 
    useGenerateReportMutation 
} = reportApi;
