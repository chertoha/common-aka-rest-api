export interface DatabaseQuery<Params, Result> {
  fetch: (params: Params) => Promise<Result>
}
