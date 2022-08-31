import { atom, Getter } from 'jotai';
import uuid from 'react-native-uuid';
import { deleteInMap, getInMap, insertAtMapIndex, setInMap } from 'src/functions';

export const styleSheetOpenAtom = atom<boolean>(false);
// export const activeDivIdAtom = atom<string | null>(null);
// export const activeDivIdsAtom = atom<string[]>([]);

// export const changeActiveDivIdAtom = atom(null, (get, set, update: string | null) => {
//   set(activeDivIdAtom, update);
// });
// export const changeActiveDivIdsAtom = atom(null, (get, set, update: string[]) => {
//   set(activeDivIdsAtom, update);
// });

/* -------------------------------------------------------------------------- */

// const initialBody: DivMap = new Map([
//   [
//     `${uuid.v4()}`,
//     { children: new Map([[`${uuid.v4()}`, { children: new Map(), name: 'div2' }]]), name: 'div' },
//   ],
// ]);

// export const bodyAtom = atom<DivMap>(initialBody);

// export function atomWithRefresh<T>(fn: (get: Getter) => T) {
//   const refreshCounter = atom(0);

//   return atom(
//     (get) => {
//       get(refreshCounter);
//       return fn(get);
//     },
//     (_, set) => set(refreshCounter, (i) => i + 1),
//   );
// }

// export const activeDivAtom = atom((get) => {
//   const divTree = get(activeDivIdsAtom)
//     .map((a) => [a, 'children'])
//     .flat();
//   return getInMap(get(bodyAtom), divTree.slice(0, divTree.length - 1)) as DivMapValue;
// });

// export const addFirstDivAtom = atom(null, (get, set) => {
//   set(bodyAtom, initialBody);
// });

// type AddDivAtomProps = { id: string; ids: string[]; position: DivPosition; name: string };
// export const addDivAtom = atom(null, (get, set, { id, ids, name, position }: AddDivAtomProps) => {
//   set(bodyAtom, () => {
//     if (position === 'inside') {
//       const childTree = ids.map((a) => [a, 'children']).flat();
//       const div = getInMap(get(bodyAtom), childTree);
//       const newDiv = insertAtMapIndex(
//         0,
//         uuid.v4() as string,
//         { children: new Map(), name },
//         div as DivMap,
//       );
//       return setInMap(get(bodyAtom), childTree, newDiv) as DivMap;
//     } else {
//       const parentTree = ids
//         .slice(0, ids.length - 1)
//         .map((a) => [a, 'children'])
//         .flat();
//       const div = parentTree.length ? getInMap(get(bodyAtom), parentTree) : get(bodyAtom);
//       const indexArray = Array.from(div as DivMap).map(([key]) => key);
//       const index = indexArray.indexOf(id);
//       const insertIndex = position === 'above' ? index : index + 1;
//       const newDiv = insertAtMapIndex(
//         insertIndex,
//         uuid.v4() as string,
//         { children: new Map(), name },
//         div as DivMap,
//       );
//       return setInMap(get(bodyAtom), parentTree, newDiv) as DivMap;
//     }
//   });
// });

// type EditDivAtomProps = {
//   id: string;
//   ids: string[];
//   value: Partial<Omit<DivMapValue, 'children'>>;
// };
// export const editDivAtom = atom(null, (get, set, { id, ids, value }: EditDivAtomProps) => {
//   set(bodyAtom, () => {
//     const parentTree: string[] = ids
//       .slice(0, ids.length - 1)
//       .map((a) => [a, 'children'])
//       .flat();
//     const parentDiv = getInMap(get(bodyAtom), parentTree) as DivMap;
//     const parentDivValue = { ...parentDiv.get(id), ...value } as DivMapValue;
//     const newDiv = parentDiv.set(id, parentDivValue);

//     return (parentTree.length ? setInMap(get(bodyAtom), parentTree, newDiv) : newDiv) as DivMap;
//   });
// });

// export const deleteDivAtom = atom(null, (get, set, ids: string[]) => {
//   set(bodyAtom, () => {
//     const childTree = ids.map((a) => [a, 'children']).flat();
//     return deleteInMap(get(bodyAtom), childTree.slice(0, childTree.length - 1)) as DivMap;
//   });
// });

// type DuplicateDivAtomProps = { id: string; ids: string[]; name: string };
// export const duplicateDivAtom = atom(null, (get, set, { id, ids, name }: DuplicateDivAtomProps) => {
//   set(bodyAtom, () => {
//     const childTree = ids.map((a) => [a, 'children']).flat();
//     const divChildren = getInMap(get(bodyAtom), childTree);
//     const parentTree: string[] = ids
//       .slice(0, ids.length - 1)
//       .map((a) => [a, 'children'])
//       .flat();
//     const div = parentTree.length ? getInMap(get(bodyAtom), parentTree) : get(bodyAtom);
//     const indexArray = Array.from(div as DivMap).map(([key]) => key);
//     const index = indexArray.indexOf(id);
//     const newDiv = insertAtMapIndex(
//       index + 1,
//       uuid.v4() as string,
//       { children: divChildren, name } as DivMapValue,
//       div as DivMap,
//     );
//     return (parentTree.length ? setInMap(get(bodyAtom), parentTree, newDiv) : newDiv) as DivMap;
//   });
// });
