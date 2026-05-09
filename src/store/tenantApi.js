import { apiSlice } from './apiSlice';

export const tenantApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerTenant: builder.mutation({
      query: (tenantData) => ({
        url: '/tenants',
        method: 'POST',
        body: tenantData,
      }),
    }),
  }),
});

export const { useRegisterTenantMutation } = tenantApi;