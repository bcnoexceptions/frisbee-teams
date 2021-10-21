import { randInt } from "../util/mathUtils";
import { GenderPref } from "./player";
import { Team } from "./team";

const BREED_ITERATIONS = 100;  // TODO: more flexible?
const BIG_BIG_NUMBER = 100000000;

/** Represents a potential list of MUFA teams */
export class TeamList {
	public teams: Team[] = [];

	public clone(): TeamList
	{
		const result = new TeamList();
		result.teams = this.teams.map(t => t.clone());
		return result;
	}

	// given this team list, "evolve" into a new one
	public evolve(): TeamList
	{
		const result = this.clone();
		for (let i = 0; i < BREED_ITERATIONS; i++) {
			const team1Index = randInt(this.teams.length);
			let team2Index = randInt(this.teams.length - 1);
			if (team2Index >= team1Index) { team2Index++; }

			const team1 = this.teams[team1Index];
			const team2 = this.teams[team2Index];

			this.breed(team1, team2);
		}
		return result;
	}

	/** "breed" two teams together to make more fair teams */
	private breed(team1: Team, team2: Team): void {
		const team1PlayersToSwap = team1.getRandomPlayerOrBaggageGroup();
		const team1GroupFMPs = team1PlayersToSwap.filter(p => p.sex === GenderPref.FMP).length;
		const team1GroupMMPs = team1PlayersToSwap.filter(p => p.sex === GenderPref.MMP).length;

		const team2PlayersToSwap = team2.findNPlayers(team1GroupFMPs, team1GroupMMPs);
		if (!team2PlayersToSwap) { return; }  // these sequences didn't want to sleep together, stupid baggage

		for (const player of team1PlayersToSwap) {
			team1.removePlayer(player);
			team2.addPlayer(player);
		}

		for (const player of team2PlayersToSwap) {
			team2.removePlayer(player);
			team1.addPlayer(player);
		}
	}

	/** measure how good a list we've got */
	public fitness(): number {
		const differences: number[] = [];

		differences.push(this.getOneDifference(t => t.scoreFMPHeight()));
		differences.push(this.getOneDifference(t => t.scoreFMPSpeed()));
		differences.push(this.getOneDifference(t => t.scoreMMPHeight()));
		differences.push(this.getOneDifference(t => t.scoreMMPSpeed()));
		differences.push(this.getOneDifference(t => t.scoreThrowSkill()));
		differences.push(this.getOneDifference(t => t.scoreXP()));

		differences.sort((p, q) => q - p);  // highest to lowest

		// avoid big discrepancies in one area by emphasizing the biggest ones
		differences[0] *= 3;
		differences[1] *= 2;
		
		const sum = differences.reduce((p, q) => p + q);

		return BIG_BIG_NUMBER - sum;
	}

	private getOneDifference(retrievalFunc: (t: Team) => number) {
		let max = 0, min = BIG_BIG_NUMBER;

		for (const team of this.teams) {
			const n = team.scoreFMPHeight();
			if (n > max) { max = n; }
			if (n < min) { max = n; }
		}
		return max - min;
	}
}
