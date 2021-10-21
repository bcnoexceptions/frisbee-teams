import * as React from 'react';
import { connect } from 'react-redux';
import { selectPlayer } from '../actions/playerAction';
import { AppState } from "../models/appState";
import { GenderPref, Player } from '../models/player';
import { Team } from '../models/team';
import "./TeamListUI.css";

interface TeamListProps {
	teams?: Team[];
	selectedPlayer: Player | null;
	onSelectPlayer(p: Player): void;
};

interface TeamListState {};

/** Component for listing all the teams */
class TeamListUI extends React.Component<TeamListProps, TeamListState> {
	public render(): JSX.Element {
		if (!this.props.teams) { return <React.Fragment />; }
		return <div className="TeamList">
			<h2>Teams</h2>
			<ul>{
				this.props.teams.map(t =>
					<TeamUI
						team={t}
						selectedPlayer={this.props.selectedPlayer}
						onSelectPlayer={this.props.onSelectPlayer}
						key={t.name}
					/>)
			}</ul>
		</div>;
	}
}

interface TeamProps {
	team: Team;
	selectedPlayer: Player | null;
	onSelectPlayer(p: Player): void;
};
interface TeamState {};

/** Component for listing one team's roster */
class TeamUI extends React.Component<TeamProps, TeamState> {
	public render(): JSX.Element {
		const fmps = this.props.team.fmps();
		const mmps = this.props.team.mmps();
		return <li className="Team">
			<h3>{this.props.team.name}</h3>
			<ol>
				{fmps.map(p => <PlayerUI player={p} selectedPlayer={this.props.selectedPlayer} onSelectPlayer={this.props.onSelectPlayer} key={p.id} />)}
			</ol>
			<br />
			<ol>
				{mmps.map(p => <PlayerUI player={p} selectedPlayer={this.props.selectedPlayer} onSelectPlayer={this.props.onSelectPlayer} key={p.id} />)}
			</ol>
			{this.teamStats()}
		</li>;
	}

	private teamStats(): JSX.Element {
		return <div>
			<h4>Stats:</h4>
			<ul>
				<li>Total FMP speed: {this.props.team.scoreFMPSpeed()}</li>
				<li>Total MMP speed: {this.props.team.scoreMMPSpeed()}</li>
				<li>Total throw skill: {this.props.team.scoreThrowSkill()}</li>
				<li>Total XP: {this.props.team.scoreXP()}</li>
			</ul>
		</div>;
	}
}

interface PlayerProps {
	player: Player;
	selectedPlayer: Player | null;
	onSelectPlayer(p: Player): void;
};
interface PlayerState {};

/** Component for showing one player */
class PlayerUI extends React.Component<PlayerProps, PlayerState> {
	public render(): JSX.Element {
		const player = this.props.player;
		const className = (player === this.props.selectedPlayer) ? "selected" : "";
		const genderChar = player.sex === GenderPref.FMP ? "F" : "M";

		const baggage = (player.baggagePW) ? <em>(Baggage: {player.baggagePW})</em> : "";

		return <li className={className} onClick={() => this.props.onSelectPlayer(player)}>
			<span>{player.name} ({genderChar}, {player.speed}/{player.experience}/{player.throwSkill}) {baggage}</span>
		</li>;
	}
}

export default connect(
	(state: AppState) => ({
		teams: state.teams?.teams,
		selectedPlayer: state.selectedPlayer,
	}),
	(dispatch: any) => ({
		onSelectPlayer: (p: Player) => {
			dispatch(selectPlayer(p));
		},
	})
)(TeamListUI);

