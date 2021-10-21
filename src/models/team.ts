import { randInt } from '../util/mathUtils';
import { GenderPref, Player } from './player';

/** Represents one MUFA team */
export class Team {
	public players: Player[] = [];
	public downFMPs = 0;  // number of FMPs they're short, relative to team with the most. Should be 0 or 1
	public downMMPs = 0;  // same for MMPs
	public name = "";

	public clone(): Team {
		const result = new Team();
		result.players = this.players.slice();  // copy
		result.downFMPs = this.downFMPs;
		result.downMMPs = this.downMMPs;
		result.name = this.name;
		return result;
	}

	/** Select a random "swappable" set of players */
	public getRandomPlayerOrBaggageGroup(): Player[] {
		const index = randInt(this.players.length);
		const selectedPlayer = this.players[index];

		if (!selectedPlayer.baggagePW) { return [selectedPlayer]; }

		return this.players.filter(p => p.baggagePW === selectedPlayer.baggagePW);
	}

	/** Find some number of MMPs/FMPs, usually to complete a set */
	public findNPlayers(targetFMPs: number, targetMMPs: number): Player[] | null {
		const playersShiftAmount = randInt(this.players.length);
		const playersButShifted =
			this.players.slice(playersShiftAmount)
				.concat(
					this.players.slice(0, playersShiftAmount));
		
		let totalFMPs = 0;
		let totalMMPs = 0;

		const foundPlayers: Player[] = [];

		for (let i = 0; i < playersButShifted.length; i++) {
			const player = playersButShifted[i];
			let baggages: Player[] = [ player ];
			if (player.baggagePW) {
				baggages = playersButShifted.filter(p => p.baggagePW === player.baggagePW);
			}

			const baggageFMP = baggages.filter(p => p.sex === GenderPref.FMP).length;
			const baggageMMP = baggages.filter(p => p.sex === GenderPref.MMP).length;

			if ((totalFMPs + baggageFMP <= targetFMPs)
				&& (totalMMPs + baggageMMP <= targetMMPs))
			{
				for (const foundPerson of baggages) {
					foundPlayers.push(foundPerson);
					playersButShifted.splice(playersButShifted.indexOf(foundPerson));
				}

				totalFMPs += baggageFMP;
				totalMMPs += baggageMMP;
			}
		}

		if (totalFMPs === targetFMPs && totalMMPs === targetMMPs) {
			return foundPlayers;
		} else {
			return null;  // naively trying to add players from the beginning didn't work. Womp Womp
		}
	}

	/** kick a player off the team */
	public removePlayer(p: Player): void {
		const index = this.players.indexOf(p);
		if (index >= 0) { this.players.splice(index, 1); }
	}

	/** add a player to the team */
	public addPlayer(p: Player): void {
		this.players.push(p);
	}

	/** copy a list of all the FMPs on the team */
	public fmps(): Player[] {
		return this.players.filter(p => p.sex === GenderPref.FMP);
	}

	/** copy a list of all the MMPs on the team */
	public mmps(): Player[] {
		return this.players.filter(p => p.sex === GenderPref.MMP);
	}

	/** evaluate the team's total speed on the FMP side */
	public scoreFMPSpeed(): number {
		return this.fmps().reduce((currentSum, player) => currentSum + player.speed, 0);
	}

	/** evaluate the team's total speed on the MMP side */
	public scoreMMPSpeed(): number {
		return this.mmps().reduce((currentSum, player) => currentSum + player.speed, 0);
	}

	/** evaluate the team's total experience */
	public scoreXP(): number {
		return this.fmps().reduce((currentSum, player) => currentSum + player.experience, 0)
			+ this.mmps().reduce((currentSum, player) => currentSum + player.experience, 0);
	}

	/** evaluate the team's total throwing ability */
	public scoreThrowSkill(): number {
		return this.fmps().reduce((currentSum, player) => currentSum + player.throwSkill, 0)
			+ this.mmps().reduce((currentSum, player) => currentSum + player.throwSkill, 0);
	}

	/** evaluate the team's total FMP height */
	public scoreFMPHeight(): number {
		// TODO: consider normalizing
		return this.fmps().reduce((currentSum, player) => currentSum + player.height, 0);
	}

	/** evaluate the team's total FMP height */
	public scoreMMPHeight(): number {
		// TODO: consider normalizing
		return this.mmps().reduce((currentSum, player) => currentSum + player.height, 0);
	}
}
