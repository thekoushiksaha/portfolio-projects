export class ApiError extends Error {
  status: number; // 0 means "no response from the server"
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export interface FormErrors {
  message: string | null; // general message for a banner
  fields: Record<string, string>; // messages to show under specific inputs
}

export function toFormErrors(error: unknown): FormErrors {
  if (error instanceof ApiError) {
    if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
      return { message: null, fields: error.fieldErrors };
    }
    return { message: error.message, fields: {} };
  }
  return { message: 'Something went wrong. Try again', fields: {} };
}