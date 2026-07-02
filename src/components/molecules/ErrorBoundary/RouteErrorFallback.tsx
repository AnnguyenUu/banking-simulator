import { Button, Result } from 'antd';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export function RouteErrorFallback() {
  const error = useRouteError();

  let message = 'An unexpected error occurred.';
  if (isRouteErrorResponse(error)) {
    message = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Result
        status="error"
        title="Something went wrong"
        subTitle={message}
        extra={
          <Button type="primary" onClick={() => window.location.assign('/')}>
            Back to Overview
          </Button>
        }
      />
    </div>
  );
}
