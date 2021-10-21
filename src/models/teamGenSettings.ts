export class TeamGenSettings {
	public minFMPs = 6;
	public maxFMPs = 10;
	public minMMPs = 6;
	public maxMMPs = 10;

	public clone(): TeamGenSettings {
		const copy = new TeamGenSettings();
		copy.minFMPs = this.minFMPs;
		copy.maxFMPs = this.maxFMPs;
		copy.minMMPs = this.minMMPs;
		copy.maxMMPs = this.maxMMPs;
		return copy;
	}
}
