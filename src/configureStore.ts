import { BaseAction } from "./root/baseAction";
import { AppState } from "./models/appState";
import { createStore, applyMiddleware, StoreEnhancer, MiddlewareAPI } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import thunk from "redux-thunk";

import { rootReducer } from "./root/rootReducer";

export const LocalStorageKey = "frisbee-teams_reduxState";

// middleware to persist the state if the app gets reloaded later
export let saveToLocalStorage = (store: MiddlewareAPI<any>) => (next: ActionProcessor) => (action: BaseAction) => {
	let result = next(action);

	// optional: check the action type if only certain actions should get stored in local storage

	let newState: AppState = store.getState() as AppState;
	localStorage.setItem(LocalStorageKey, JSON.stringify(newState));
	return result;
};

export default function configureStore(initialState?: AppState | string) {
	// remove "saveToLocalStorage" to not persist across reloads
	const middlewares = [thunk];
	const middlewareEnhancer = applyMiddleware(...middlewares);

	// add additional middlewares here as needed
	const storeEnhancers = [middlewareEnhancer];

	const composedEnhancer = composeWithDevTools(...storeEnhancers) as StoreEnhancer;

	if (typeof initialState === "string") {
		initialState = new AppState(initialState);
	}
	const store = createStore(rootReducer, initialState, composedEnhancer);

	// set up hot module reloading for the reducers - see:
	// https://blog.isquaredsoftware.com/2016/11/practical-redux-part-3-project-planning-and-setup/
	if (process.env.NODE_ENV !== "production") {
		if (module.hot) {
			module.hot.accept("./root/rootReducer", () => {
				const newReducer = require("./root/rootReducer").default;
				store.replaceReducer(newReducer);
			});
		}
	}

	return store;
}

interface ActionProcessor {
	(action: BaseAction): any;
}
