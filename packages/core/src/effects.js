export {
  take,
  takeMaybe,
  put,
  putResolve,
  all,
  race,
  call,
  apply,
  cps,
  fork,
  spawn,
  join,
  cancel,
  select,
  actionChannel,
  cancelled,
  flush,
  getContext,
  setContext,
  delay,
} from './internal/io'

export { debounce, retry, takeEvery, takeLatest, takeLeading, throttle } from './internal/io-helpers'

import * as effectTypes from './internal/effectTypes'

export { effectTypes }
// 也是一些方法的导出 让API看起来更加清晰
