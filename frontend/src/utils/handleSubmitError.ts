import { z } from 'zod';

interface handleSubmitErrorProps {
  err: unknown,
  setNotification: React.Dispatch<React.SetStateAction<{
    type: string
    message: string
  }>>
}

export default function handleSubmitError ({ err, setNotification }:
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
  setNotification({ type: 'error', message: errorMessage });
  return {
    success: false,
    error: errorMessage
  };
}
