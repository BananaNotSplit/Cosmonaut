import { Client, time } from "discord.js";
import Module from "./Module";
import EntangledModule from "./EntangledModule";

export default class ModuleLoader {
	targets: typeof Module[]

	modules: Module[] = []
	timeouts: NodeJS.Timeout[] = []

	Load(client: Client) {
		this.targets.forEach(target => {
			// @ts-ignore
			var newModule: Module = new target(client) // yeah yeah subclasses shut up TS
			this.modules.push(newModule)
		})
		console.log(`loaded ${this.modules.length} module(s)`)

		this.modules.forEach(module => {
			if (module instanceof EntangledModule) {
				this.timeouts.push(setInterval(() => {
					module.SaveData()
				}, 1000 * 60 * 15))
			}
		})
	}

	Cleanup() {
		this.timeouts.forEach(timeout => clearInterval(timeout))
		this.modules.forEach(module => module.Cleanup())
	}

	constructor(targets: typeof Module[] = []) {
		this.targets = targets
	}
}