import { Client, Events, Message } from "discord.js";

export default abstract class Module {
	client: Client

	Ready(): void { }

	Cleanup(): void { }

	MessageCreate(message: Message, fromSelf: boolean, botMentioned: boolean) { }

	MessageCreateRaw(message: Message) {
		if (!this.client.user) return
		this.MessageCreate(
			message,
			message.author === this.client.user,
			message.mentions.has(this.client.user)
		)
	}



	constructor(client: Client) {
		this.client = client
		
		this.client.on(Events.MessageCreate, (message) => this.MessageCreateRaw(message))
		this.client.on(Events.ClientReady, () => this.Ready())
	}
}