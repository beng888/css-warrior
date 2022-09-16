import create from 'zustand';
import uuid from 'react-native-uuid';
import {
  deDupDiv,
  deleteInMap,
  flattenMap,
  flattenObject,
  getInMap,
  insertAtMapIndex,
  mapToObject,
  objectToMap,
  setInMap,
  toSameKeyJson,
} from 'src/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export interface ISettings {
  historyLimit: number;
  showInlineStyles: boolean;
}
interface CanvasState {
  body: DivMap;
  settings: ISettings;
  saveSettings(val: ISettings): void;
  save(item: string): void;
  isSaveable(): boolean;
  savedData: Record<string, DivMapValue> | null;
  setSavedData(data: Record<string, DivMapValue>): void;
  isEdited(): boolean;
  history: Record<string, DivMapValue>[];
  updateHistory(): void;
  currentHistory: number;
  unDoable(): boolean;
  undoHistory(): void;
  reDoable(): boolean;
  redoHistory(): void;
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

const addToHistory = (
  newBody: DivMap,
  history: Record<string, DivMapValue>[],
  current: number,
  limit: number,
) => {
  const limitExceeded = history.length > limit;
  let newHistory = [...history, mapToObject(newBody)];
  let currentHistory = current + 1;

  if (limitExceeded) {
    newHistory = newHistory.slice(newHistory.length - (limit + 1), newHistory.length);
    currentHistory = limit + 1;
  }

  if (current < history.length) {
    newHistory = [...history.slice(0, current), mapToObject(newBody)];
    currentHistory = current + 1;
  }

  return { history: newHistory, currentHistory };
};

const getInitialBody = (): DivMap =>
  new Map([[`${uuid.v4()}`, { children: new Map(), name: 'div' }]]);

const initialHistory = mapToObject(getInitialBody());

const useCanvasStore = create<CanvasState>((set, get) => ({
  body: getInitialBody(),
  settings: {
    historyLimit: 50,
    showInlineStyles: true,
  },
  saveSettings: (val) => set(() => ({ settings: val })),
  save: async (item) => {
    const { history, currentHistory } = get();
    const currentBody = history[currentHistory - 1];
    if (currentBody) {
      const jsonValue = JSON.stringify(currentBody);
      set({ savedData: currentBody });
      try {
        await AsyncStorage.setItem(item, jsonValue);
      } catch (e) {}
    }
  },
  isSaveable: () => {
    const { history, savedData, currentHistory } = get();
    const current = history[currentHistory - 1];

    if (current && savedData) {
      const toSameKeyJson = (obj: Record<string, any>) =>
        JSON.stringify(
          Object.fromEntries(
            flattenObject(obj).map(([, value]: [string, DivMapValue], i: number) => [
              `map-${i}`,
              value,
            ]),
          ),
        );
      const strSavedData = toSameKeyJson(savedData);
      const strCurrent = toSameKeyJson(current);

      const isEqual = strSavedData === strCurrent;
      return !isEqual;
    }

    return false;
  },
  setSavedData: (data) =>
    set(() => {
      const newData = data ?? mapToObject(getInitialBody());

      return {
        savedData: newData,
        body: objectToMap(newData),
        history: [newData],
        currentHistory: 1,
      };
    }),
  savedData: null,
  isEdited: () => {
    const { history, body, currentHistory } = get();
    const current = history[currentHistory - 1] || history[0];
    const currentBody = mapToObject(body);
    if (current && currentBody) {
      const strCurrentBody = toSameKeyJson(currentBody);
      const strCurrent = toSameKeyJson(current);
      const isEqual = strCurrentBody === strCurrent;
      return !isEqual;
    }

    return false;
  },
  history: [],
  updateHistory: () =>
    set((state) => {
      return {
        ...addToHistory(
          state.body,
          state.history,
          state.currentHistory,
          state.settings.historyLimit,
        ),
      };
    }),
  currentHistory: 0,
  styleSheetOpen: false,
  setStyleSheetOpen: (val) => set(() => ({ styleSheetOpen: val })),
  activeDivId: null,
  setActiveDivId: (val) => set(() => ({ activeDivId: val })),
  activeDivIds: [],
  setActiveDivIds: (val) => set(() => ({ activeDivIds: val })),
  getFlattenedBody: () => flattenMap(get().body),
  unDoable: () => get().currentHistory > 1,
  undoHistory: () =>
    set((state) => {
      const { currentHistory, history } = state;

      const prevHistory = currentHistory > 1 ? currentHistory - 1 : 1;
      const previousBody = history[prevHistory - 1] || initialHistory;

      return {
        currentHistory: prevHistory,
        body: objectToMap(previousBody),
      };
    }),
  reDoable: () => get().currentHistory < get().history.length,
  redoHistory: () =>
    set((state) => {
      const { currentHistory, history } = state;

      const nextHistory = currentHistory + 1;
      const nextBody = history[nextHistory - 1] || history[nextHistory - 1] || initialHistory;

      return {
        currentHistory: nextHistory,
        body: objectToMap(nextBody),
      };
    }),
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
  addFirstDiv: () =>
    set((state) => {
      const newBody = getInitialBody();
      return {
        body: newBody,
        ...addToHistory(newBody, state.history, state.currentHistory, state.settings.historyLimit),
      };
    }),
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

        const newBody = setInMap(state.body, childTree, newDiv) as DivMap;

        return {
          body: newBody,
          ...addToHistory(
            newBody,
            state.history,
            state.currentHistory,
            state.settings.historyLimit,
          ),
        };
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

        const newBody = (
          parentTree.length ? setInMap(state.body, parentTree, newDiv) : newDiv
        ) as DivMap;

        return {
          body: newBody,
          ...addToHistory(
            newBody,
            state.history,
            state.currentHistory,
            state.settings.historyLimit,
          ),
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

      const newBody = deleteInMap(state.body, childTree.slice(0, childTree.length - 1)) as DivMap;

      return {
        body: newBody,
        ...addToHistory(newBody, state.history, state.currentHistory, state.settings.historyLimit),
      };
    }),
  duplicateDiv: (name) =>
    set((state) => {
      const parentTree: string[] = get()
        .activeDivIds.slice(0, get().activeDivIds.length - 1)
        .map((a) => [a, 'children'])
        .flat();
      const div = (parentTree.length ? getInMap(state.body, parentTree) : state.body) as DivMap;
      const deDupedDiv = deDupDiv(div);
      const indexArray = Array.from(div).map(([key]) => key);
      const index = indexArray.indexOf(get().activeDivId as string);

      const newDiv = insertAtMapIndex(
        index + 1,
        uuid.v4() as string,
        { ...Array.from(deDupedDiv)[0]?.[1], name } as DivMapValue,
        div,
      );

      const newBody = (
        parentTree.length ? setInMap(state.body, parentTree, newDiv) : newDiv
      ) as DivMap;

      return {
        body: newBody,
        ...addToHistory(newBody, state.history, state.currentHistory, state.settings.historyLimit),
      };
    }),
}));

export default useCanvasStore;
