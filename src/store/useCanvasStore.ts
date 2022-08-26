import create from 'zustand';
import uuid from 'react-native-uuid';
import { deleteInMap, getInMap, insertAtMapIndex, setInMap } from 'src/functions';

const styles = { height: 100, width: 100, borderColor: 'orange', borderWidth: 1, margin: 10 };

const body: DivMap = new Map([
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
  getActiveDiv(): DivMapValue;
  activeDivId: string | null;
  setActiveDivId(value: string | null): void;
  activeDivIds: string[];
  setActiveDivIds(value: string[]): void;
  addFirstDiv(): void;
  addDiv(id: string, ids: string[], position: DivPosition, name: string): void;
  editDiv(id: string, ids: string[], name: Partial<Omit<DivMapValue, 'children'>>): void;
  deleteDiv(ids: string[]): void;
  duplicateDiv(id: string, ids: string[], name: string): void;
}

const initialBody: DivMap = new Map([
  [
    `${uuid.v4()}`,
    { children: new Map([[`${uuid.v4()}`, { children: new Map(), name: 'div2' }]]), name: 'div' },
  ],
]);

const useCanvasStore = create<CanvasState>((set, get) => ({
  body: initialBody,
  getActiveDiv: () => {
    const divTree = get()
      .activeDivIds.map((a) => [a, 'children'])
      .flat();
    return getInMap(get().body, divTree.slice(0, divTree.length - 1)) as DivMapValue;
  },
  activeDivId: null,
  setActiveDivId: (value) => set(() => ({ activeDivId: value })),
  activeDivIds: [],
  setActiveDivIds: (value) => set(() => ({ activeDivIds: value })),
  addFirstDiv: () => set(() => ({ body: initialBody })),
  addDiv: (id, ids, position, name) =>
    set((state) => {
      if (position === 'inside') {
        const childTree = ids.map((a) => [a, 'children']).flat();
        const div = getInMap(state.body, childTree);
        const newDiv = insertAtMapIndex(
          0,
          uuid.v4() as string,
          { children: new Map(), name },
          div as DivMap,
        );
        return { body: setInMap(state.body, childTree, newDiv) as DivMap };
      } else {
        const parentTree = ids
          .slice(0, ids.length - 1)
          .map((a) => [a, 'children'])
          .flat();
        const div = parentTree.length ? getInMap(state.body, parentTree) : state.body;
        const indexArray = Array.from(div as DivMap).map(([key]) => key);
        const index = indexArray.indexOf(id);
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
  editDiv: (id, ids, value) =>
    set((state) => {
      const parentTree: string[] = ids
        .slice(0, ids.length - 1)
        .map((a) => [a, 'children'])
        .flat();
      const parentDiv = getInMap(state.body, parentTree) as DivMap;
      const newDiv = parentDiv.set(id, {
        ...parentDiv.get(id),
        ...value,
        children: parentDiv.get(id)?.children as DivMap,
      });

      // console.log('%c⧭', 'color: #00e600', { parentTree, parentDiv, newDiv });

      return {
        body: (parentTree.length ? setInMap(state.body, parentTree, newDiv) : newDiv) as DivMap,
      };
    }),
  deleteDiv: (ids) =>
    set((state) => {
      const childTree = ids.map((a) => [a, 'children']).flat();
      return { body: deleteInMap(state.body, childTree.slice(0, childTree.length - 1)) as DivMap };
    }),
  duplicateDiv: (id, ids, name) =>
    set((state) => {
      const childTree = ids.map((a) => [a, 'children']).flat();
      const divChildren = getInMap(state.body, childTree);
      const parentTree: string[] = ids
        .slice(0, ids.length - 1)
        .map((a) => [a, 'children'])
        .flat();
      const div = parentTree.length ? getInMap(state.body, parentTree) : state.body;
      const indexArray = Array.from(div as DivMap).map(([key]) => key);
      const index = indexArray.indexOf(id);
      const newDiv = insertAtMapIndex(
        index + 1,
        uuid.v4() as string,
        { children: divChildren, name } as DivMapValue,
        div as DivMap,
      );
      return {
        body: (parentTree.length ? setInMap(state.body, parentTree, newDiv) : newDiv) as DivMap,
      };
    }),
}));

export default useCanvasStore;
