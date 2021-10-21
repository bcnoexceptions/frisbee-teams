import * as React from 'react';
import { connect } from 'react-redux';
import { evolve } from '../teamgen/evolveAction';
import { AppState } from "../models/appState";
import { createTeams } from '../teamgen/initialGen';
import "./SettingsAndLauncher.css";

interface SettingsAndLaunchersProps {
	onInitialCreate(): void;
	onEvolve(): void;
};

interface SettingsAndLaunchersState {};

/** Component for action buttons for the app */
class SettingsAndLaunchers extends React.Component<SettingsAndLaunchersProps, SettingsAndLaunchersState> {
	public render(): JSX.Element {
		return <div className="SettingsAndLauncher">
			<button onClick={this.props.onInitialCreate}>Start From Scratch</button>
			<button onClick={this.props.onEvolve}>Evolve</button>
		</div>;
	}
}

export default connect(
	(state: AppState) => ({
		player: state.selectedPlayer,
	}),
	(dispatch: any) => ({
		onInitialCreate: () => dispatch(createTeams()),
		onEvolve: () => dispatch(evolve()),
	})
)(SettingsAndLaunchers);


