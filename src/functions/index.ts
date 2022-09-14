import uuid from 'react-native-uuid';

type DivType = DivMap | DivMapValue;

export function getInMap(data: DivType, [prop, ...rest]: string[]): DivType {
  if (!!prop) {
    if (data instanceof Map && data.has(prop)) {
      const _data = data.get(prop);
      if (!!_data) {
        const newData: DivMapValue = _data;
        if (rest.length) return getInMap(newData, rest);
        return newData;
      }
    }
    if (prop === 'children' && 'children' in data) {
      const _data = data as DivMapValue;
      const newData: DivMap = _data[prop];
      if (rest.length) return getInMap(newData, rest);
      return newData;
    }
  }
  return data;
}

export function setInMap(data: DivType, [prop, ...rest]: string[], value: DivMap): DivType {
  let newData: DivType = data;

  if (!!prop) {
    if (data instanceof Map && data.has(prop)) {
      newData = data as DivMap;
      const newValue = rest.length ? setInMap(data.get(prop) as DivMapValue, rest, value) : value;
      newData.set(prop, newValue as DivMapValue);
    }

    if (prop === 'children' && 'children' in data) {
      newData = data as DivMapValue;
      const newValue = rest.length ? setInMap(data[prop], rest, value) : value;
      newData[prop] = newValue as DivMap;
    }
  }
  return newData;
}

// export function setIn(data: any = {}, [prop, ...rest]: (string | number)[], value: any) {
//   const newData: any = Array.isArray(data) ? [...data] : { ...data };
//   if (prop !== undefined) {
//     newData[prop as keyof typeof newData] = rest.length ? setIn(data[prop], rest, value) : value;
//   }
//   return newData;
// }

export function deleteInMap(data: DivType, [prop, ...rest]: string[]): DivType {
  let newData: DivType = data;

  if (!!prop) {
    if (data instanceof Map && data.has(prop)) {
      newData = data as DivMap;
      rest.length
        ? newData.set(prop, deleteInMap(data.get(prop) as DivMapValue, rest) as DivMapValue)
        : newData.delete(prop);
    }

    if (prop === 'children' && 'children' in data) {
      newData = data as DivMapValue;
      newData[prop] = deleteInMap(data[prop], rest) as DivMap;
    }
  }
  return newData;
}

export function deDupDiv(div: DivMap) {
  return new Map(
    Array.from(div).map(([, value]) => {
      if (value.children.size > 0) {
        const newValue: DivMap = deDupDiv(value.children);
        return [uuid.v4(), { ...value, children: newValue }];
      }

      return [uuid.v4(), value];
    }) as Iterable<[string, DivMapValue]>,
  );
}

export function mapToObject(div: DivMap): Record<string, DivMapValue> {
  const fromEntries: Record<string, DivMapValue> = Object.fromEntries(div);
  const entries = Object.entries(fromEntries).map(([key, value]) => [
    key,
    { ...value, children: mapToObject(value.children) },
  ]);

  return Object.fromEntries(entries);
}

export function objectToMap(obj: Record<string, DivMapValue>): DivMap {
  return new Map(
    Object.entries(obj).map(([key, value]) => {
      const { children } = value;
      return [
        key,
        { ...value, children: children instanceof Map ? children : objectToMap(children) },
      ];
    }),
  );
}

export function mapToArray(div: DivMap): ([string, DivMapValue] | [string, any])[] {
  return Array.from(div).map((item) => {
    const [key, value] = item;
    if (value.children.size > 0) return [key, { ...value, children: mapToArray(value.children) }];
    return item;
  });
}

export function arrayToMap(div: [string, DivMapValue] | [string, any]): DivMap {
  return new Map(
    div.map((item) => {
      const [key, value] = item;
      if (value.children.length > 0) {
        return [key, { ...value, children: arrayToMap(value.children) }];
      }
      return item;
    }),
  );
}

export function flattenMap(map: DivMap) {
  const flattenedArray: unknown[] = Array.from(map)
    .map(([key, value]) => {
      const { children, ...rest } = value;
      if (children.size > 0) {
        return [[[key, rest]], [...flattenMap(children)]];
      }
      return [[[key, rest]]];
    })
    .flat(2);
  return new Map(flattenedArray as Iterable<[string, DivMapValue]>);
}

export function flattenObject(obj: Record<string, any>): any {
  return Object.entries(obj)
    .map(([key, value]) => {
      const { children, ...rest } = value;
      return [[[key, rest]], [...flattenObject(children)]];
    })
    .flat(2);
}

export function insertAtMapIndex(
  index: number,
  key: string,
  value: DivMapValue,
  map: DivMap,
): DivMap {
  const arr = Array.from(map);
  arr.splice(index, 0, [key, value]);
  return new Map(arr as Iterable<[string, DivMapValue]>);
}

export function toNumberElseString(str: string) {
  const number = parseFloat(str);
  if (!isNaN(number) && isFinite(number)) return number;
  return str;
}

export const toSameKeyJson = (obj: Record<string, any>) =>
  JSON.stringify(
    Object.fromEntries(
      flattenObject(obj).map(([, value]: [string, DivMapValue], i: number) => [`map-${i}`, value]),
    ),
  );

/* -------------------------------------------------------------------------- */
/*                                   DRAFTS                                   */
/* -------------------------------------------------------------------------- */

//* gets nested object using array of strings
// const object = array.reduce((acc: DivProps | undefined, cur: string, index) => {
//   if (index === 0 && acc![cur]) return acc![cur]?.children;
//   if (acc![cur]) return acc![cur]?.children;
//   return acc;
// }, body);

//* gets nested item inside array or object
// export function getIn(data: any = {}, [prop, ...rest]: (string | number)[]): any {
//   if (prop !== undefined) {
//     const newData = data[prop];
//     if (rest.length) return getIn(newData, rest);
//     return newData;
//   }
// }

//* gets nested Map inside a Map
// export function getInMap(data: MapObject, [prop, ...rest]: any[]): DivMap {
//   if (prop !== undefined) {
//     if (data[prop] || data?.has?.(prop)) {
//       const newData: MapObject = data?.has?.(prop) ? data.get(prop) : data[prop];
//       if (rest.length) return getInMap(newData, rest);
//       return newData;
//     }
//   }
//   return new Map();
// }

//* sets new value inside of a nested array or object
// export function setIn(data: any = {}, [prop, ...rest]: (string | number)[], value: any) {
//   const newData: any = Array.isArray(data) ? [...data] : { ...data };
//   if (prop !== undefined) {
//     newData[prop as keyof typeof newData] = rest.length ? setIn(data[prop], rest, value) : value;
//   }
//   return newData;
// }

//* sets new nested Map inside a Map
// export function setInMap(data: MapObject, [prop, ...rest]: any[], value: DivMap): DivMap {
//   const newData: MapObject = data;
//   if (prop !== undefined) {
//     if (data?.has !== undefined) {
//       newData.set(prop, rest.length ? setInMap(data.get(prop), rest, value) : value);
//     }

//     if (typeof data === 'object' && prop in data) {
//       newData[prop as keyof typeof newData] = rest.length
//         ? setInMap(data[prop], rest, value)
//         : value;
//     }
//   }
//   return newData;
// }
