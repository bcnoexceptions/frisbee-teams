import { TeamGenSettings } from './teamGenSettings';
import { makeRandomPlayer, Player } from "./player";
import { TeamList } from "./teamList";

const NUMBER_OF_PLAYERS = 1000;

export class AppState {
	allPlayers: Player[] = [];
	selectedPlayer: Player | null = null;
	teams: TeamList | null = null;
	evolvableTeamLists: TeamList[] = [];
	genSettings: TeamGenSettings = new TeamGenSettings();

	public constructor(other?: AppState | string) {
		if (other) {
			if (typeof other === "string") {
				// commented out; no cookie jawnz for now
				//this._deserializeFrom(other);
				//return;
			} else {
				this.allPlayers = other.allPlayers;
				this.selectedPlayer = other.selectedPlayer;
				this.teams = other.teams;
				this.evolvableTeamLists = other.evolvableTeamLists;
				this.genSettings = other.genSettings;
				return;
			}
		}

		this.allPlayers = [];
		// in reality, would load from DB
		for (let i = 0; i < NUMBER_OF_PLAYERS; i++) {
			const player = makeRandomPlayer();
			player.id = i + 1;
			this.allPlayers.push(player);
		}

		this.selectedPlayer = null;
		this.teams = null;
		this.evolvableTeamLists = [];
		this.genSettings = new TeamGenSettings();
	}

	/*
	private _deserializeFrom(other: string) {
		let json = JSON.parse(other);
	}
	*/
}
