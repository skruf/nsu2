const filter = <T, U>(item: T | any, stub: U): U | any => {
  const data = {}

  for(const key in item) {
    if(Object.hasOwnProperty.call(stub, key)) {
      let value = item[key]
      if(Array.isArray(value)) {
        data[key] = value
        // console.log(value)
        // data[key] = value.map(
        //   (v: any) => typeof v === "object" ? filter(v, stub[key]) : v
        // )
      } else if(typeof value === "object") {
        data[key] = value = filter(value, stub[key])
      } else {
        data[key] = value
      }
    }
  }

  return data
}

export default <T, U>(item: (T | T[]), stub: U): U | U[] => (
  Array.isArray(item)
    ? item.map((i) => filter(i, stub))
    : filter<T, U>(item, stub)
)
