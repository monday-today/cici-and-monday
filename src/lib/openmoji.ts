const CDN = 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg'

export const o = (hex: string) => `${CDN}/${hex}.svg`

export const O = {
  heart: o('2764'),
  sparklingHeart: o('1F496'),
  giftHeart: o('1F49D'),
  twoHearts: o('1F495'),
  memo: o('1F4DD'),
  camera: o('1F4F7'),
  calendar: o('1F4C5'),
  book: o('1F4D6'),
  globe: o('1F30D'),
  sparkles: o('2728'),
  cake: o('1F382'),
  smile: o('1F60A'),
  calm: o('1F60C'),
  pleading: o('1F97A'),
  pray: o('1F64F'),
  party: o('1F389'),
  speechBubble: o('1F4AC'),
  loveLetter: o('1F48C'),
  chef: o('1F469-200D-1F373'),
  clock: o('23F3'),
  cooking: o('1F372'),
  warning: o('26A0'),
  location: o('1F3D9'),
} as const
