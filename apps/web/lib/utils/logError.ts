import { ROUTES } from '@/app/(user)/routes';
import { ADMIN_ROUTES } from '@/app/admin/routes';
import { toast } from '@/hooks/useToast';

const messageToToast = (
  message: string | { title: string; description: string },
) => {
  if (typeof message === 'object') {
    return {
      title: message.title,
      description: message.description,
    };
  }
  return {
    description: message,
  };
};

export const logError = (
  error: any,
  extractorFn?: (
    error: any,
  ) => string | string[] | { title: string; description: string },
) => {
  if (!error.response && error instanceof Error) {
    const errorMessage = error.message || 'An unknown error occurred';
    toast({
      description: errorMessage,
      variant: 'error',
    });
  } else {
    try {
      error.response.json().then((data: { message: string }) => {
        const errorMessage =
          extractorFn && typeof extractorFn === 'function'
            ? extractorFn(data)
            : data.message || 'An unknown error occurred';
        if (Array.isArray(errorMessage)) {
          errorMessage.forEach((message, index) => {
            setTimeout(() => {
              toast({
                ...messageToToast(message),
                variant: 'error',
                key: `error-${
                  typeof message === 'object' && 'title' in message
                    ? (message as any).title
                    : message
                }`,
              });
            }, 1000 * index);
          });
        } else {
          toast({
            ...messageToToast(errorMessage),
            variant: 'error',
          });
        }
      });
    } catch (error) {
      toast({
        description: 'An unknown error occurred',
        variant: 'error',
      });
    }
  }

  // Optionally log to console in development
  // if (process.env.NODE_ENV === 'development') {
  //   console.error(error);
  // }
};

export const tempRouteUnauthorizedErrorHandler =
  (router: any, application: 'user' | 'admin') => (error: any) => {
    (error as any).response
      .json()
      .then((data: { message: string; statusCode: number }) => {
        if (data.statusCode === 401) {
          if (application === 'user') {
            router.push(ROUTES.LOGIN);
          } else {
            router.push(ADMIN_ROUTES.LOGIN);
          }
          logError(new Error('Session Expired'));
        } else {
          logError(new Error(data.message));
        }
      });
  };
