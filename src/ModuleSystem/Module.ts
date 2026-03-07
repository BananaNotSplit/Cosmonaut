import { AnyThreadChannel, CacheType, Client, Events, ForumChannel, Interaction, Message, User, UserContextMenuCommandInteraction } from "discord.js";

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

	ThreadCreate(thread: AnyThreadChannel, root: Message<true>|null) { }

	ForumPostCreated(thread: AnyThreadChannel, forum: ForumChannel, root: Message<true>|null) { }

	async TheadCreateRaw(thread: AnyThreadChannel): Promise<void> {
		const root = await thread.fetchStarterMessage()
		if (thread.parent instanceof ForumChannel) {
			this.ForumPostCreated(thread, thread.parent, root)
  		} else {
			this.ThreadCreate(thread, root)
		}
	}

	UserContextMenuCommand(interaction: UserContextMenuCommandInteraction, firing: User, target: User, command: string) { }

	InteractionCreate(interaction: Interaction<CacheType>) {
		if (interaction.isUserContextMenuCommand()) {
			this.UserContextMenuCommand(
				interaction,
				interaction.user,
				interaction.targetUser,
				interaction.commandId
			)
		}
	}

	constructor(client: Client) {
		this.client = client
		
		this.client.on(Events.ClientReady, () => this.Ready())
		this.client.on(Events.MessageCreate, (message) => this.MessageCreateRaw(message))
		this.client.on(Events.ThreadCreate, (thread) => this.TheadCreateRaw(thread))
		this.client.on(Events.InteractionCreate, (interaction) => this.InteractionCreate(interaction))
	}
}