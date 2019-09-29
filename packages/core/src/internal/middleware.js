import * as is from '@redux-saga/is'
import { check, assignWithSymbols, createSetContextWarning } from './utils'
import { stdChannel } from './channel'
import { runSaga } from './runSaga'

// 这是放入redux middleware的东西，也是redux-saga的default export
// 看起来是默认用了stdChannel通信
export default function sagaMiddlewareFactory({ context = {}, channel = stdChannel(), sagaMonitor, ...options } = {}) {
  let boundRunSaga

  if (process.env.NODE_ENV !== 'production') {
    check(channel, is.channel, 'options.channel passed to the Saga middleware is not a channel')
  }

  function sagaMiddleware({ getState, dispatch }) {
    boundRunSaga = runSaga.bind(null, {
      ...options,
      context,
      channel,
      dispatch,
      getState,
      sagaMonitor,
    })

    return next => action => {
      if (sagaMonitor && sagaMonitor.actionDispatched) {
        sagaMonitor.actionDispatched(action)
      }
      const result = next(action) // hit reducers
      channel.put(action)
      return result
    }
  }

  sagaMiddleware.run = (...args) => {
    if (process.env.NODE_ENV !== 'production' && !boundRunSaga) {
      throw new Error('Before running a Saga, you must mount the Saga middleware on the Store using applyMiddleware')
    }
    // 为啥不自动run呢
    return boundRunSaga(...args)
  }

  sagaMiddleware.setContext = props => {
    if (process.env.NODE_ENV !== 'production') {
      check(props, is.object, createSetContextWarning('sagaMiddleware', props))
    }

    assignWithSymbols(context, props)
  }

  return sagaMiddleware
}
