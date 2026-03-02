import { Message } from "discord.js";
import Module from "../ModuleSystem/Module";
import ModuleClient from "../ModuleSystem/ModuleClient";

export class ShutdownModule extends Module {
	MessageCreate(message: Message, fromSelf: boolean, botMentioned: boolean): void {
		if (fromSelf) return
		if (!botMentioned) return
		if (message.author.id !== "1058428311119855636") return
		if (!message.content.startsWith("exit")) return
		message.reply("goodbye")
		.then(() => {
			if (this.client instanceof ModuleClient) {
				this.client.Cleanup()
				this.client.destroy()
				console.log("Got exit command.")
				process.exit(0)
			}
		})
	}
}