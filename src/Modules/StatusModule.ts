import { Client } from "discord.js";
import EntangledModule from "../ModuleSystem/EntangledModule";

export interface IStatusModuleConfiguration {
	statuses: string[]
}

export class StatusModule extends EntangledModule<IStatusModuleConfiguration> {
	NewData(): IStatusModuleConfiguration {
		return {
			statuses: [
				"edit StatusModule.json"
			]
		}
	}

	Ready(): void {
		this.client.user?.setPresence({
			activities: [
				{
					name: "hi"
				}
			]
		})
	}

	Cleanup(): void {
		super.Cleanup()
	}
}