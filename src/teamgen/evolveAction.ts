import { assignEvolutionCandidates, assignTeams } from "../actions/teamAction";
import { AppState } from "../models/appState";
import { TeamList } from "../models/teamList";
import { Dispatcher } from "../util/reduxHelpers";
import { generateTeamList } from "./initialGen";

const EVOLUTION_VAT_SIZE = 100;

/** Apply the genetic algorithm to come up with new/better teams */
export function evolve(): Function {
	return async (dispatch: Dispatcher, getState: () => AppState) => {

		const state = getState();
		let startingPoint: TeamList[] = [];
		if (!state.evolvableTeamLists || !state.evolvableTeamLists.length) {
			// start out with a nice evolution vat
			const titles = state.teams!.teams.map(t => t.name);

			for (let i = 0; i < EVOLUTION_VAT_SIZE; i++) {
				const teamsArr = generateTeamList(state.allPlayers, titles.length, state.genSettings, titles);
				const teamList = new TeamList();
				teamList.teams = teamsArr;
				startingPoint.push(teamList);
			}
		}
		else {
			startingPoint = state.evolvableTeamLists.slice();
		}

		let vat = startingPoint.slice();
		for (const teamList of startingPoint) {
			vat.push(teamList.evolve());
		}

		vat.sort((list1, list2) => list2.fitness() - list1.fitness());

		vat = vat.slice(0, EVOLUTION_VAT_SIZE);

		dispatch(assignEvolutionCandidates(vat));
		dispatch(assignTeams(vat[0].teams));
	}
}

