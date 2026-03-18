export const withTimeout = async <T>(
  promise: Promise<T>,
  ms = 90000,
): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new Error(
          "Yeu cau dang xu ly lau hon du kien. Vui long thu lai sau it phut.",
        ),
      );
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

export const toPublicError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
};
