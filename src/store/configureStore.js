import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from "./reducers";
import * as sagaWatchers from './sagas';

export function configureStore(initialState) {
    const sagaMiddleware = createSagaMiddleware();

    const enhancer = compose(
        applyMiddleware(sagaMiddleware),
        window.__REDUX_DEVTOOLS_EXTENSION__
            ? window.__REDUX_DEVTOOLS_EXTENSION__({ name: 'strava-stats' })
            : f => f,
    )

    const store = createStore(rootReducer, initialState, enhancer)

    Object.keys(sagaWatchers).forEach(watcher => {
        sagaMiddleware.run(sagaWatchers[watcher])
    })

    return store;
}
