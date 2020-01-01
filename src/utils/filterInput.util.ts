interface MockObject {
  [key: string]: any
}

const filter = (item: MockObject, stub: MockObject): MockObject => {
  const data: any = {}

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

export default (
  item: (MockObject | MockObject[]), stub: MockObject
): MockObject => {
  let data: MockObject

  if(Array.isArray(item)) {
    data = item.map((i: any) => filter(i, stub))
  } else {
    data = filter(item, stub)
  }

  return data
}
