type pfn = () => Promise<any>

export default (fns: pfn[]) =>
  fns.reduce((promise, fn: pfn) =>
    promise.then(
      (result) => fn().then(Array.prototype.concat.bind(result))
    ), Promise.resolve([])
  )
