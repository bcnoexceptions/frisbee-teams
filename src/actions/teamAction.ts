import { Team } from "../models/team";
import { TeamList } from "../models/teamList";
import { ActionTypeEnum, BaseAction } from "../root/baseAction";

export interface TeamListAction extends BaseAction {
	teams: Team[];
}

export function assignTeams(teams: Team[]): TeamListAction {
	return { type: ActionTypeEnum.AssignTeams, teams };
}

export interface AssignEvolutionAction extends BaseAction {
	teamLists: TeamList[];
}

export function assignEvolutionCandidates(teamLists: TeamList[]): AssignEvolutionAction {
	return { type: ActionTypeEnum.AssignEvolutionGeneration, teamLists };
}
