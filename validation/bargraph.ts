// validation/stats/bargraph.ts

import { z } from 'zod';

export const BarGraphSchema = z.object({
  year: z
    .number({ required_error: 'year is required', invalid_type_error: 'year must be a number' })
    .min(2000, 'year must be ≥2000')
    .max(new Date().getFullYear(), `year cannot be in the future`),
});

// for convenience, export the inferred TypeScript type too
export type BarGraphInput = z.infer<typeof BarGraphSchema>;
