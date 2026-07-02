export function debounce<This, Args extends unknown[]>(
  fn: (this: This, ...args: Args) => void,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: This, ...args: Args) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}