import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from "../models/appState";
import { GenderPref, Player } from '../models/player';
import "./SelectedPlayer.css";

interface SelectedPlayerProps {
	player: Player | null;
};

interface SelectedPlayerState {};

/** Component for drilling into a specific player's stats */
class SelectedPlayer extends React.Component<SelectedPlayerProps, SelectedPlayerState> {
	public render(): JSX.Element {
		if (!this.props.player) { return <div className="SelectedPlayer" />; }
		return <div className="SelectedPlayer">
			<h3>{this.props.player.name}</h3>
			<div>Gender Preference: {GenderPref[this.props.player.sex]}</div>
			<div>Speed: {this.props.player.speed}</div>
			<div>Experience: {this.props.player.experience}</div>
			<div>Throws: {this.props.player.throwSkill}</div>
		</div>;
	}
}

export default connect(
	(state: AppState) => ({
		player: state.selectedPlayer,
	}),
	(_dispatch: any) => ({
	})
)(SelectedPlayer);

