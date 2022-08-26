import React from 'react';
import TestSheet from './TestSheet';

export default function AppOverlay(props: Overlay) {
  const overlayType: Record<OverlayTypes, any> = {
    'bottom-sheet': TestSheet,
  };

  const Component = overlayType[props.type];

  return <Component {...props} />;
}
