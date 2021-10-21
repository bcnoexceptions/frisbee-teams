import * as React from 'react';
import { connect } from 'react-redux';
import { selectPlayer } from '../actions/playerAction';
import { AppState } from "../models/appState";
import { Player } from '../models/player';
import "./PlayerList.css";

interface PlayerListProps {
	players: Player[];
	selectedPlayer: Player | null;

	onSelectPlayer(p: Player): void;
};

interface PlayerListState {};

/** Component for listing all players in the league */
class PlayerList extends React.Component<PlayerListProps, PlayerListState> {
	public render(): JSX.Element {
		return <ul className="PlayerList">{
			this.props.players.map(p => this.renderOnePlayer(p))
		}</ul>;
	}

	private renderOnePlayer(p: Player): JSX.Element {
		const selected = p === this.props.selectedPlayer;
		const className = selected ? "selected" : "";
		return <li className={className} key={p.id} onClick={() => this.props.onSelectPlayer(p)}>{p.name}</li>;
	}
}

export default connect(
	(state: AppState) => ({
		players: state.allPlayers,
		selectedPlayer: state.selectedPlayer,
	}),
	(dispatch: any) => ({
		onSelectPlayer: (p: Player) => {
			dispatch(selectPlayer(p));
		},
	})
)(PlayerList);
