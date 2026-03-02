import { Client, ClientOptions } from "discord.js";
import Module from "./Module";
import ModuleLoader from "./ModuleLoader";

export default class ModuleClient extends Client {
	loader: ModuleLoader

	Setup(login: string) {
		this.loader.Load(this)
		this.login(login)
	}

	Cleanup() {
		this.loader.Cleanup()
	}

	constructor(options: ClientOptions, targets: typeof Module[] = []) {
		super(options)
		this.loader = new ModuleLoader(targets)
	}
}