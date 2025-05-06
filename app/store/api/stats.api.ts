import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BarGraphResponse, BillSummaryModel, MonthlyPieChartResponse, YearlyPieChartResponse } from '@/app/models/Models';
import { MonthlyPieChartInput } from '@/validation/piechart.monthly';
import { YearlyPieChartInput } from '@/validation/piechart.yearly';
import { BarGraphInput } from '@/validation/bargraph';


export const statsApi = createApi({
  reducerPath: 'statsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/stats/' }),
  endpoints: (builder) => ({
    // GET /api/stats
    getBillSummary: builder.query<BillSummaryModel,void>({
      query: () => '',
      transformResponse: (response: { data: BillSummaryModel }) => response.data,
    }),

    //POST /api/stats/piechartMontly
    getPieChartMonthly : builder.mutation<MonthlyPieChartResponse ,MonthlyPieChartInput>({
      query: (body) => ({
        url: "piechartmonthly",
        method: "POST",
        body, 
      }),
      transformResponse: (res: { data: MonthlyPieChartResponse  }) => res.data,
   }),

  //POST /api/stats/piechartYearly
    getPieChartYearly : builder.mutation<YearlyPieChartResponse ,YearlyPieChartInput>({
      query: (body) => ({
        url: "piechartyearly",
        method: "POST",
        body, 
      }),
      transformResponse: (res: { data: YearlyPieChartResponse }) => res.data,
  }),

  //GET /api/stats/bargraph
    getBarGraph: builder.mutation<BarGraphResponse,BarGraphInput>({
      query: (body) => ({
        url: "bargraph",
        method: "POST",
        body
      }),
      transformResponse: (res: {data: BarGraphResponse}) => res.data,
    })
})
});

export const {
  useGetBillSummaryQuery,
  useGetPieChartMonthlyMutation,
  useGetPieChartYearlyMutation,
  useGetBarGraphMutation
} = statsApi;
