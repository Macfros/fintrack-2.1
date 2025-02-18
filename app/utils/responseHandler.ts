import { NextResponse } from "next/server";
// Standardized success response handler
export function SuccessResponse(data: any, message?: string) {
    return NextResponse.json(
      message ? { message, data } : data, // Include message only if provided
      { status: 200 }
    );
  }
  
  // Standardized error response handler
  export function ErrorResponse(message: string, status: number) {
    return NextResponse.json({ message }, { status });
  }
  
