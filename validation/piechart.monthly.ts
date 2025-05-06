// validation/stats/monthlyPieChart.ts

import { z } from 'zod';

export const MonthlyPieChartSchema = z.object({
  month: z
    .number({ required_error: 'month is required', invalid_type_error: 'month must be a number' })
    .min(1, 'month must be between 1 and 12')
    .max(12, 'month must be between 1 and 12'),
  year: z
    .number({ required_error: 'year is required', invalid_type_error: 'year must be a number' })
    .min(2000, 'year must be ≥2000')
    .max(new Date().getFullYear(), `year cannot be in the future`),
});

// for convenience, export the inferred TypeScript type too
export type MonthlyPieChartInput = z.infer<typeof MonthlyPieChartSchema>;
