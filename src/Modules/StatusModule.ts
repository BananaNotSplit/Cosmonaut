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

	SetRandomStatus(): void {
		if (!this.data) return
		var status = this.data.statuses[Math.floor(Math.random()*this.data.statuses.length)];
		this.client.user?.setPresence({
			activities: [
				{
					name: status ?? "Failed to get status 3:"
				}
			]
		})
	}

	Ready(): void {
		this.SetRandomStatus()
	}

	Cleanup(): void {
		super.Cleanup()
	}
}