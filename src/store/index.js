import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const middlewares = []

const persistConfig = {
    key: 'react-app',
    keyPrefix: '',
    storage,
    whitelist: ['authLogin']
}


const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    devTools: true,
    middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
            immutableCheck: false,
			serializableCheck: false,
		}).concat(middlewares),
})

export const persistor = persistStore(store)
export default store