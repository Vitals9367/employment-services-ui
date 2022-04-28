export const isExternalLink = (href: string): boolean|undefined => {
  const isExternalLink = href && (href.startsWith("https://") || href.startsWith("https://"));
  return isExternalLink || false
};