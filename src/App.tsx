import React from "react";
import PlayerList from "./components/PlayerList";
import SelectedPlayer from "./components/SelectedPlayer";
import SettingsAndLaunchers from "./components/SettingsAndLaunchers";
import TeamListUI from "./components/TeamListUI";

import "./App.css";

export interface IAppProps {}

export default class App extends React.Component<IAppProps, any> {
	public render() {
		return (
			<div className="App">
				<div className="rightColumn">
					<PlayerList />
					<SelectedPlayer />
				</div>
				<div className="leftColumn">
					<SettingsAndLaunchers />
					<TeamListUI />
				</div>
			</div>
		);
	}
}
