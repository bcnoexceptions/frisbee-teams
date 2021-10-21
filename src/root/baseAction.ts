
export enum ActionTypeEnum {
	SelectPlayer = "SelectPlayer",
	AssignTeams = "AssignTeams",
	AssignEvolutionGeneration = "AssignEvolutionGeneration",
}

export interface BaseAction {
	type: ActionTypeEnum;
}