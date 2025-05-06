// app/api/bills/manual/POST.ts
import { NextRequest } from 'next/server';
import { uploadBillManually } from '@/app/services/BillService';
import { ErrorResponse, SuccessResponse } from '@/app/utils/responseHandler';

export async function POST(request: NextRequest) {
  try {
    
    const formData = await request.formData();

    const userId = request.headers.get('x-user-id')!;
 
    const created = await uploadBillManually(formData, userId);
    if (!created) {
      return ErrorResponse('Failed to upload bill', 500);
    }

    // 4. Return success
    return SuccessResponse(created, 'Bill uploaded successfully');

  } catch (err: unknown) {
    console.error('POST /api/bills/manual error:', err);
    return ErrorResponse('Internal Server Error', 500);
  }
}
