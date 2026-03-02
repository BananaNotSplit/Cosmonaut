import { Client, Events, Message } from "discord.js";

export default abstract class Module {
	client: Client

	Load(): void {
		this.client.on(Events.MessageCreate, (message) => this.MessageCreateRaw(message))
		this.client.on(Events.ClientReady, () => this.Ready())
	}

	Ready(): void { }

	Cleanup(): void { }

	MessageCreate(message: Message, fromSelf: boolean) { }

	MessageCreateRaw(message: Message) {
		this.MessageCreate(message, message.author === this.client.user)
	}

	constructor(client: Client) {
		this.client = client
	}
}