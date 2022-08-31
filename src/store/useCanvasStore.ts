import create from 'zustand';
import uuid from 'react-native-uuid';
import {
  deDupDiv,
  deleteInMap,
  flattenMap,
  getInMap,
  insertAtMapIndex,
  setInMap,
} from 'src/functions';

const styles = { height: 100, width: 100, borderColor: 'orange', borderWidth: 1, margin: 10 };

export const testBody: DivMap = new Map([
  [
    'qwe',
    {
      ...styles,
      name: 'qwe',
      children: new Map([
        [
          'asd',
          {
            ...styles,
            name: 'asd',
            children: new Map([
              [
                'zxc',
                {
                  ...styles,
                  name: 'zxc',
                  children: new Map([
                    [
                      'rty',
                      {
                        ...styles,
                        name: 'rty',
                        children: new Map([
                          [
                            'fgh',
                            {
                              ...styles,
                              name: 'fgh',
                              children: new Map([
                                [
                                  'vbn',
                                  {
                                    ...styles,
                                    name: 'vbn',
                                    children: new Map([
                                      [
                                        'uio',
                                        {
                                          ...styles,
                                          name: 'uio',
                                          children: new Map([
                                            [
                                              'jkl',
                                              { ...styles, name: 'jkl', children: new Map() },
                                            ],
                                          ]),
                                        },
                                      ],
                                    ]),
                                  },
                                ],
                              ]),
                            },
                          ],
                        ]),
                      },
                    ],
                  ]),
                },
              ],
            ]),
          },
        ],
      ]),
    },
  ],
]);

interface CanvasState {
  body: DivMap;
  styleSheetOpen: boolean;
  setStyleSheetOpen(val: boolean): void;
  activeDivId: string | null;
  setActiveDivId(val: string | null): void;
  activeDivIds: string[];
  setActiveDivIds(val: string[]): void;
  getFlattenedBody(): DivMap;
  getActiveDiv(): DivMapValue;
  getActiveDivParent(): DivMap;
  addFirstDiv(): void;
  addDiv(position: DivPosition, name: string): void;
  editDiv(value: Partial<Omit<DivMapValue, 'children'>>): void;
  deleteDiv(): void;
  duplicateDiv(name: string): void;
}

const initialBody: DivMap = new Map([
  [
    `${uuid.v4()}`,
    { children: new Map([[`${uuid.v4()}`, { children: new Map(), name: 'div2' }]]), name: 'div' },
  ],
]);

const useCanvasStore = create<CanvasState>((set, get) => ({
  body: initialBody,
  styleSheetOpen: false,
  setStyleSheetOpen: (val) => set(() => ({ styleSheetOpen: val })),
  activeDivId: null,
  setActiveDivId: (val) => set(() => ({ activeDivId: val })),
  activeDivIds: [],
  setActiveDivIds: (val) => set(() => ({ activeDivIds: val })),
  getFlattenedBody: () => flattenMap(get().body),
  getActiveDiv: () => {
    const divTree = get()
      .activeDivIds.map((a) => [a, 'children'])
      .flat();
    return getInMap(get().body, divTree.slice(0, divTree.length - 1)) as DivMapValue;
  },
  getActiveDivParent: () => {
    const parentTree = get()
      .activeDivIds.slice(0, get().activeDivIds.length - 1)
      .map((a) => [a, 'children'])
      .flat();
    return parentTree.length ? (getInMap(get().body, parentTree) as DivMap) : get().body;
  },
  addFirstDiv: () => set(() => ({ body: initialBody })),
  addDiv: (position, name) =>
    set((state) => {
      if (position === 'inside') {
        const childTree = get()
          .activeDivIds.map((a) => [a, 'children'])
          .flat();
        const div = getInMap(state.body, childTree);
        const newDiv = insertAtMapIndex(
          0,
          uuid.v4() as string,
          { children: new Map(), name },
          div as DivMap,
        );
        return { body: setInMap(state.body, childTree, newDiv) as DivMap };
      } else {
        const parentTree = get()
          .activeDivIds.slice(0, get().activeDivIds.length - 1)
          .map((a) => [a, 'children'])
          .flat();
        const div = parentTree.length ? getInMap(state.body, parentTree) : state.body;
        const indexArray = Array.from(div as DivMap).map(([key]) => key);
        const index = indexArray.indexOf(get().activeDivId as string);
        const insertIndex = position === 'above' ? index : index + 1;
        const newDiv = insertAtMapIndex(
          insertIndex,
          uuid.v4() as string,
          { children: new Map(), name },
          div as DivMap,
        );
        return {
          body: (parentTree.length ? setInMap(state.body, parentTree, newDiv) : newDiv) as DivMap,
        };
      }
    }),
  editDiv: (value) =>
    set((state) => {
      const parentTree: string[] = get()
        .activeDivIds.slice(0, get().activeDivIds.length - 1)
        .map((a) => [a, 'children'])
        .flat();
      const parentDiv = getInMap(state.body, parentTree) as DivMap;
      const parentDivValue = {
        ...parentDiv.get(get().activeDivId as string),
        ...value,
      } as DivMapValue;
      const newDiv = parentDiv.set(get().activeDivId as string, parentDivValue);
      return {
        body: (parentTree.length ? setInMap(state.body, parentTree, newDiv) : newDiv) as DivMap,
      };
    }),
  deleteDiv: () =>
    set((state) => {
      const childTree = get()
        .activeDivIds.map((a) => [a, 'children'])
        .flat();
      return { body: deleteInMap(state.body, childTree.slice(0, childTree.length - 1)) as DivMap };
    }),
  duplicateDiv: (name) =>
    set((state) => {
      const childTree = get()
        .activeDivIds.map((a) => [a, 'children'])
        .flat();
      const divChildren = getInMap(state.body, childTree);
      const parentTree: string[] = get()
        .activeDivIds.slice(0, get().activeDivIds.length - 1)
        .map((a) => [a, 'children'])
        .flat();
      const div = parentTree.length ? getInMap(state.body, parentTree) : state.body;
      const deDupedDiv = deDupDiv(div as DivMap);
      const indexArray = Array.from(deDupedDiv).map(([key]) => key);
      const index = indexArray.indexOf(get().activeDivId as string);
      const newDiv = insertAtMapIndex(
        index + 1,
        uuid.v4() as string,
        { children: divChildren, name } as DivMapValue,
        deDupedDiv,
      );
      return {
        body: (parentTree.length ? setInMap(state.body, parentTree, newDiv) : newDiv) as DivMap,
      };
    }),
}));

export default useCanvasStore;
