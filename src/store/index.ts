import { createStore, combineReducers } from "redux";

import { gameReducer } from "./reducers";

const rootReducer = combineReducers({
  game: gameReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const store = createStore(
    rootReducer
  );

  return store;
}
