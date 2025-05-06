import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BillModel, BillSummaryModel } from '@/app/models/Models';

export const billApi = createApi({
  reducerPath: 'billApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/bills/' }),
  endpoints: (builder) => ({
    // GET /api/bills
    getBills: builder.query<BillModel[], void>({
      query: () => '',
      transformResponse: (response: { data: BillModel[] }) => response.data,
    }),

    // POST /api/bills/manual
    addManualBill: builder.mutation<BillModel, FormData>({
      query: (newBill) => ({
        url: 'manual',
        method: 'POST',
        body: newBill,
      }),
      transformResponse: (response: { data: BillModel }) => response.data,
    }),

    // POST /api/bills/ai
    addAiBill: builder.mutation<BillModel, FormData>({
      query: (newBill) => ({
        url: 'ai',
        method: 'POST',
        body: newBill,
      }),
      transformResponse: (response: { data: BillModel }) => response.data,
    }),

    // DELETE /api/bills/:id
    deleteBill: builder.mutation<void, string>({
      query: (id) => ({
        url: id,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetBillsQuery,
  useAddManualBillMutation,
  useAddAiBillMutation,
  useDeleteBillMutation,
} = billApi;
