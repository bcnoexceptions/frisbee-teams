import { BaseAction } from "../root/baseAction";

export interface NextProcessor {
	(act: BaseAction): void;
}

export interface Dispatcher {
	(action: Function | BaseAction): void;
}
