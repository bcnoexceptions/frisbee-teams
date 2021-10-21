import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import configureStore, { LocalStorageKey } from "./configureStore";

let localState = localStorage.getItem(LocalStorageKey);

const store = configureStore(localState || undefined);
const root = document.getElementById("root");

let render = () => {
	const App = require("./App").default;
	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>,
		root
	);
};

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// set up hot module reloading - see:
// https://blog.isquaredsoftware.com/2016/11/practical-redux-part-3-project-planning-and-setup/
if (module.hot) {
	const mainRender = render;

	// display an overlay for runtime errors
	const renderError = (error: any) => {
		const RedBox = require("redbox-react").default;
		ReactDOM.render(<RedBox error={error} />, root);
	};

	// In development, we wrap the rendering function to catch errors,
	// and if something breaks, log the error and render it to the screen
	let refresh = () => {
		try {
			mainRender();
		} catch (error) {
			console.error(error);
			renderError(error);
		}
	};

	// Whenever the App component file or one of its dependencies
	// is changed, re-import the updated component and re-render it
	module.hot.accept("./App", () => {
		setTimeout(refresh);
	});
}
