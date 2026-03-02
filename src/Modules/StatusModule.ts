import { Client } from "discord.js";
import EntangledModule from "../ModuleSystem/EntangledModule";

export interface IRefreshTime {
	hours: number
	minutes: number
	seconds: number
}

export interface IStatusModuleConfiguration {
	statuses: string[]
	refresh: IRefreshTime
}

export class StatusModule extends EntangledModule<IStatusModuleConfiguration> {
	statusTimeout: NodeJS.Timeout|null = null

	NewData(): IStatusModuleConfiguration {
		return {
			statuses: [
				"edit StatusModule.json"
			],
			refresh: { hours: 5, minutes: 0, seconds: 0 }
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
		if (!this.data) return
		this.SetRandomStatus()
		this.statusTimeout = setInterval(() => this.SetRandomStatus(),
		(this.data?.refresh.seconds + (this.data?.refresh.minutes + this.data?.refresh.hours * 60) * 60) * 1000
	)
	}

	Cleanup(): void {
		super.Cleanup()
	}
}