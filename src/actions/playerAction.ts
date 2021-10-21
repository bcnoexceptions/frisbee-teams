import { Player } from "../models/player";
import { ActionTypeEnum, BaseAction } from "../root/baseAction";

export interface PlayerAction extends BaseAction {
	player: Player;
}

export function selectPlayer(p: Player): PlayerAction {
	return { type: ActionTypeEnum.SelectPlayer, player: p };
}