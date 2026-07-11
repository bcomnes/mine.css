declare module 'uhtml-isomorphic' {
  export function html(strings: readonly string[], ...values: unknown[]): unknown
  export function render(where: StringConstructor, what: unknown): string
}
