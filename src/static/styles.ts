const flexAlignType = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'];

export const border = {
  borderStyle: ['solid', 'dotted', 'dashed'],
  'border-Width': {
    borderBottomWidth: 'number',
    borderEndWidth: 'number',
    borderLeftWidth: 'number',
    borderRightWidth: 'number',
    borderStartWidth: 'number',
    borderTopWidth: 'number',
    borderWidth: 'number',
  },
  'border-Color': {
    borderBottomColor: 'color',
    borderColor: 'color',
    borderEndColor: 'color',
    borderLeftColor: 'color',
    borderRightColor: 'color',
    borderStartColor: 'color',
    borderTopColor: 'color',
  },
  'border-Radius': {
    borderRadius: 'number',
    borderBottomEndRadius: 'number',
    borderBottomLeftRadius: 'number',
    borderBottomRightRadius: 'number',
    borderBottomStartRadius: 'number',
    borderTopEndRadius: 'number',
    borderTopLeftRadius: 'number',
    borderTopRightRadius: 'number',
    borderTopStartRadius: 'number',
  },
};

export const padding = {
  padding: 'number|string',
  paddingBottom: 'number|string',
  paddingEnd: 'number|string',
  paddingHorizontal: 'number|string',
  paddingLeft: 'number|string',
  paddingRight: 'number|string',
  paddingStart: 'number|string',
  paddingTop: 'number|string',
  paddingVertical: 'number|string',
};

export const margin = {
  margin: 'number|string',
  marginTop: 'number|string',
  marginLeft: 'number|string',
  marginRight: 'number|string',
  marginBottom: 'number|string',
  marginEnd: 'number|string',
  marginStart: 'number|string',
  marginVertical: 'number|string',
  marginHorizontal: 'number|string',
};

export const heightWidth = {
  height: 'number|string',
  minHeight: 'number|string',
  maxHeight: 'number|string',
  width: 'number|string',
  minWidth: 'number|string',
  maxWidth: 'number|string',
  aspectRatio: 'number',
};

export const flex = {
  alignContent: ['flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around'],
  alignItems: flexAlignType,
  alignSelf: [...flexAlignType, 'auto'],
  flex: 'number',
  flexBasis: 'number|string',
  flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
  flexGrow: 'number',
  flexShrink: 'number',
  flexWrap: ['wrap', 'nowrap', 'wrap-reverse'],
  justifyContent: [
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
  ],
};

export const position = {
  position: ['relative', 'absolute'],
  bottom: 'number|string',
  left: 'number|string',
  right: 'number|string',
  top: 'number|string',
  zIndex: 'number',
};

export const display = {
  display: ['flex', 'none'],
  overflow: ['visible', 'hidden', 'scroll'],
  backfaceVisibility: ['visible', 'hidden'],
  backgroundColor: 'color',
  opacity: 'number',
};

export const transform = {
  rotate: 'string',
  rotateX: 'string',
  rotateY: 'string',
  rotateZ: 'string',
  scale: 'number',
  scaleX: 'number',
  scaleY: 'number',
  translateX: 'number',
  translateY: 'number',
  skewX: 'string',
  skewY: 'string',
};
