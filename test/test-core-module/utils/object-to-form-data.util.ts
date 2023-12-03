export function serialize(obj: Record<string, unknown>): Record<string, string | number | boolean> {
  return Object.entries(serializeObject(obj)).reduce(
    (acc, [key, value]) => ({ ...acc, [key.replace('[', '').replace(']', '')]: value }),
    {}
  )
}

function serializeObject(obj: Record<string, unknown>, prefix: string = ''): Record<string, string | number | boolean> {
  let result = {}
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      result = value.reduce(
        (acc, elem, index) => Object.assign(acc, serializeObject(elem, `${prefix}[${key}][${index}]`)),
        result
      )
    } else if (typeof value === 'object') {
      result = { ...result, ...serializeObject(value as Record<string, unknown>, `${prefix}[${key}]`) }
    } else {
      result[`${prefix}[${key}]`] = value
    }
  }

  return result
}
