import { ViewStyle } from 'react-native';

declare global {
  type State<T> = React.Dispatch<React.SetStateAction<T>>;

  /* --------------------------------- DIV-MAP -------------------------------- */

  type DivValue = ViewStyle & { children?: DivProps };

  // type DivProps = {
  //   [key: string]: DivValue;
  // };

  type DivProps = Record<string, DivValue>;

  // type DivProps = {
  //   [key: string]: ViewStyle & { children?: DivProps[] };
  // } ;

  type DivMapValue = ViewStyle & { children: DivMap; name?: string } & {
    [prop in keyof ViewStyle as `${prop}-default`]?: string | value;
  };

  type DivMap = Map<string, DivMapValue>;

  type KeyOfMap<M extends Map<unknown, unknown>> = M extends Map<infer K, unknown> ? K : never;

  type DivPosition = 'above' | 'inside' | 'below';

  type MapObject = Record<string, DivMapValue & { children: MapObject }>;

  /* --------------------------------- OVERLAY -------------------------------- */

  type OverlayTypes = 'bottom-sheet';

  interface Overlay {
    open: boolean;
    content: React.ReactNode;
    type: OverlayTypes;
    id: string;
    zIndex?: number;
  }

  type Overlays = {
    [key: string]: Overlay;
  };

  /* ----------------------------------- ETC ---------------------------------- */
}
