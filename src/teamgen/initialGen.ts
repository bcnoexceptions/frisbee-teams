import { TeamGenSettings } from './../models/teamGenSettings';
import { Dispatcher } from '../util/reduxHelpers';
import { AppState } from '../models/appState';
import { retrieveNRandomTitles } from '../util/wikipedia';
import { GenderPref, Player } from '../models/player';
import { Team } from '../models/team';
import { assignTeams } from '../actions/teamAction';

/** Start with a basic list of teams */
export function createTeams(): Function {
	return async (dispatch: Dispatcher, getState: () => AppState) => {

		const state = getState();
		const numTeams = calculateNumberOfTeams(state.allPlayers, state.genSettings);

		const titles = await retrieveNRandomTitles(numTeams);
		if (titles.length === 0) {
			console.log("FAILED TO LOAD TEAM NAMES"); // TODO
		}

		const teams = generateTeamList(state.allPlayers, numTeams, state.genSettings, titles);

		dispatch(assignTeams(teams));
	}
}

/** Generate the teams once we have names for them (non-async) */
export function generateTeamList(allPlayers: Player[], numTeams: number, genSettings: TeamGenSettings, names: string[]): Team[] {
	const teams = makeNTeams(allPlayers, numTeams, genSettings);
	for (let i = 0; i < teams.length; i++) {
		teams[i].name = names[i];
	}
	return teams;
}

// TODO: this definitely needs a unit test!
/** Determine how many teams we're looking at */
function calculateNumberOfTeams(players: Player[], genSettings: TeamGenSettings): number {
	const fmps = players.filter(p => p.sex === GenderPref.FMP).length;
	const mmps = players.filter(p => p.sex === GenderPref.MMP).length;

	let minGenderPlayerCount: number, minGenderMinTeamSize: number;
	let maxGenderPlayerCount: number, maxGenderMinTeamSize: number;
	if (fmps > mmps) {
		minGenderPlayerCount = mmps;
		minGenderMinTeamSize = genSettings.minMMPs;
		maxGenderPlayerCount = fmps;
		maxGenderMinTeamSize = genSettings.minFMPs;
	} else {
		minGenderPlayerCount = fmps;
		minGenderMinTeamSize = genSettings.minFMPs;
		maxGenderPlayerCount = mmps;
		maxGenderMinTeamSize = genSettings.minMMPs;
	}

	const numTeamsByMinGender = Math.floor(minGenderPlayerCount / minGenderMinTeamSize);
	const numTeamsByMaxGender = Math.floor(maxGenderPlayerCount / maxGenderMinTeamSize);

	return Math.min(numTeamsByMinGender, numTeamsByMaxGender);
}

/** Generate N teams */
function makeNTeams(allPlayers: Player[], numTeams: number, genSettings: TeamGenSettings): Team[] {
	const fmps = allPlayers.filter(p => p.sex === GenderPref.FMP);
	const mmps = allPlayers.filter(p => p.sex === GenderPref.MMP);
	const baggaged = allPlayers.filter(p => !!p.baggagePW);

	let fmpsPerTeam = Math.floor(fmps.length / numTeams);
	let mmpsPerTeam = Math.floor(mmps.length / numTeams);

	if (fmpsPerTeam > genSettings.maxFMPs) { fmpsPerTeam = genSettings.maxFMPs; }
	if (mmpsPerTeam > genSettings.maxMMPs) { mmpsPerTeam = genSettings.maxMMPs; }

	const result: Team[] = [];
	for (let i = 0; i < numTeams; i++) {
		result.push(new Team());
	}

	addBaggages(result, fmps, mmps, baggaged, fmpsPerTeam, mmpsPerTeam, genSettings);
	addEveryoneElse(result, fmps, mmps, fmpsPerTeam, mmpsPerTeam, genSettings);

	return result;
}

/** Add baggaged players to the teams */
function addBaggages(result: Team[], fmps: Player[], mmps: Player[], baggaged: Player[], fmpsPerTeam: number, mmpsPerTeam: number, genSettings: TeamGenSettings) {
	const baggageSets = findBaggageSets(baggaged);
	baggageSets.sort((set1, set2) => set2.length - set1.length);  // start with the biggest, hardest ones

	let currentTeamIndex = -1; // will be set to 0 first loop
	let skips = 0;
	while (baggageSets.length > 0 && skips < result.length) {   // too many skips means baggages fucked this up and we gave up

		currentTeamIndex++;
		if (currentTeamIndex >= result.length) { currentTeamIndex = 0; }  // cycle back around

		const group = baggageSets[0];  // we'll pop them off this end

		const team = result[currentTeamIndex];
		const teamFMPs = team.fmps().length;
		const teamMMPs = team.mmps().length;
		const baggageFMPs = group.filter(p => p.sex === GenderPref.FMP).length;
		const baggageMMPs = group.filter(p => p.sex === GenderPref.MMP).length;

		// add one because round-off could mean an extra player on some teams
		if (baggageFMPs + teamFMPs > fmpsPerTeam + 1
			|| baggageFMPs + teamFMPs > genSettings.maxFMPs
			|| baggageMMPs + teamMMPs > mmpsPerTeam + 1
			|| baggageMMPs + teamMMPs > genSettings.maxMMPs
		)
		{
			skips++;
			continue;
		}

		// we have room on this team for this group
		skips = 0;

		for (const player of group) {
			team.players.push(player);
			if (player.sex === GenderPref.FMP) { fmps.splice(fmps.indexOf(player)); }
			else if (player.sex === GenderPref.MMP) { mmps.splice(mmps.indexOf(player)); }
		}

		baggageSets.shift();
	}

	if (skips >= result.length) {
		console.log("TOO MANY SKIPS, END BAGGAGE MANIA");
	}
}

/** Find all the people that are baggage'd */
function findBaggageSets(baggaged: Player[]): Player[][] {
	const baggageSets: Player[][] = [];
	const foundBaggagePWs = new Set<string>();
	for (let i = 0; i < baggaged.length; i++) {
		const pw = baggaged[i].baggagePW!;
		if (foundBaggagePWs.has(pw)) { continue; }  // already did this group

		foundBaggagePWs.add(pw);
		baggageSets.push(baggaged.filter(p => p.baggagePW === pw));
	}
	return baggageSets;
}

/** Add non-baggaged players to the list */
function addEveryoneElse(result: Team[], fmps: Player[], mmps: Player[], fmpsPerTeam: number, mmpsPerTeam: number, genSettings: TeamGenSettings) {
	addToReachMinimums(result, fmps, mmps, fmpsPerTeam, mmpsPerTeam);

	const numTeams = result.length;
	if (fmpsPerTeam < genSettings.maxFMPs) {
		// add leftover FMPs to teams
		for (let teamIndex = 0; teamIndex < numTeams && fmps.length > 0; teamIndex++) {
			const team = result[teamIndex];
			const currentTeamFMPs = team.fmps().length;

			if (currentTeamFMPs === fmpsPerTeam) { team.players.push(fmps.shift()!); }
		}
	}
	if (mmpsPerTeam < genSettings.maxMMPs) {
		// add leftover MMPs to teams
		for (let teamIndex = 0; teamIndex < numTeams && mmps.length > 0; teamIndex++) {
			const team = result[teamIndex];
			const currentTeamMMPs = team.mmps().length;

			if (currentTeamMMPs === mmpsPerTeam) { team.players.push(mmps.shift()!); }
		}
	}

	// anyone still leftover missed being put on a team. Deal with it!
}

/** Add enough players such that each team has the minimum number of players (we'll fill in gaps later) */
function addToReachMinimums(result: Team[], fmps: Player[], mmps: Player[], fmpsPerTeam: number, mmpsPerTeam: number) {
	let skips = 0;
	let teamIndex = -1;
	while (fmps.length > 0 && skips < result.length) {
		teamIndex++;
		if (teamIndex >= result.length) { teamIndex = 0; }  // wrap around

		const team = result[teamIndex];
		if (team.fmps().length >= fmpsPerTeam) {
			skips++;
		} else {
			// found a home for her
			skips = 0;
			team.players.push(fmps.shift()!);
		}
	}
	skips = 0;
	teamIndex = -1;
	while (mmps.length > 0 && skips < result.length) {
		teamIndex++;
		if (teamIndex >= result.length) { teamIndex = 0; }  // wrap around

		const team = result[teamIndex];
		if (team.mmps().length >= mmpsPerTeam) {
			skips++;
		} else {
			// found a home for him
			skips = 0;
			team.players.push(mmps.shift()!);
		}
	}
}

