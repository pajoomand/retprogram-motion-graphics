export const videoMediaPath = (
  config: { readonly mediaBasePath: string },
  file: string,
): string => {
  const segments = file.split("/");
  if (
    !/^courses\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
      config.mediaBasePath,
    ) ||
    segments.some((segment) => !/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(segment))
  ) {
    throw new Error(
      `Invalid video media path: ${config.mediaBasePath}/${file}`,
    );
  }
  return `${config.mediaBasePath}/${file}`;
};
