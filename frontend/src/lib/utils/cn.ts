export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return clsx(...inputs);
}
