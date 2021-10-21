import { PlayerAction } from "../actions/playerAction";
import { AssignEvolutionAction, TeamListAction } from "../actions/teamAction";
import { AppState } from "../models/appState";
import { TeamList } from "../models/teamList";
import { BaseAction, ActionTypeEnum } from "./baseAction";

export function rootReducer(oldState: AppState = new AppState(), action: BaseAction) {
	let newState: AppState;

	switch (action.type) {
		case ActionTypeEnum.SelectPlayer:
			newState = new AppState(oldState);
			newState.selectedPlayer = (action as PlayerAction).player;
			return newState;
		
		case ActionTypeEnum.AssignTeams:
			newState = new AppState(oldState);
			newState.teams = new TeamList();
			newState.teams.teams = (action as TeamListAction).teams;
			return newState;
		
		case ActionTypeEnum.AssignEvolutionGeneration:
			newState = new AppState(oldState);
			newState.evolvableTeamLists = (action as AssignEvolutionAction).teamLists;
			return newState;

		default:
			return oldState;
	}
}
