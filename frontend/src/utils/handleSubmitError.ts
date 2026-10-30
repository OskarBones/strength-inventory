import { z } from 'zod';

import { type NotificationProps } from '@strength-inventory/schemas/frontend';

interface handleSubmitErrorProps {
  err: unknown,
  dispatch: React.Dispatch<NotificationProps>
}

export default function handleSubmitError ({ err, dispatch }:
handleSubmitErrorProps) {
  let errorMessage: string;
  if (err instanceof z.ZodError) {
    const messages = err.issues.map((issue) => issue.message);
    console.error(messages);
    errorMessage = `${String(err.issues[0].path[0])}: ${err.issues[0].message}`;
  } else if (err instanceof Error) {
    errorMessage = err.message;
  } else {
    errorMessage = 'Unknown error!';
  }
  dispatch({ type: 'error', message: errorMessage });
  return {
    success: false,
    error: errorMessage
  };
}
