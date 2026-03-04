import { AnyThreadChannel, ForumChannel, Message, Snowflake, TextChannel } from "discord.js"
import EntangledModule from "../ModuleSystem/EntangledModule"

export interface ILevelModuleConfig {
	LevelUpScalar: number
	MessageXp: number
	PostXp: number|null

	Levels: {[user: Snowflake]: {level: number, xp: number}}

	LevelUpChannel: Snowflake|null
}

function XpForEachLevel(level: number, scalar: number): number {
	if (level <= 0) return 0
	return (scalar * level * (level + 1)) / 2
} // uhh chatgpt im just gonna trust you :sob: it works tho (tested it)

export default class LevelModule extends EntangledModule<ILevelModuleConfig> {
	levelUpChannel: TextChannel|null = null

	NewData(): ILevelModuleConfig {
		return {
			LevelUpScalar: 10,
			MessageXp: 1,
			PostXp: null,
			Levels: {},
			LevelUpChannel: null
		}
	}

	Ready(): void {
		if (this.data.LevelUpChannel) {
			console.info("Finding level up channel")
			this.client.channels.fetch(this.data.LevelUpChannel)
			.then(channel => this.LevelUpChannelFound(channel))
		}
	}

	LevelUpChannelFound(channel: any) {
		if (channel instanceof TextChannel) {
			console.log("Got level up channel")
			this.levelUpChannel = channel
		}
	}

	AddXp(source: Message, amount: number): boolean {
		var record = this.data.Levels[source.author.id]
		if (!record) {
			record = { level: 0, xp: 0 }
			this.data.Levels[source.author.id] = record // set the property for saving!
		}

		record.xp += amount
		if (record.xp >= XpForEachLevel(record.level, this.data.LevelUpScalar)) {
			record.level ++
			record.xp = 0 // not working out that math rn
			return true
		}

		return false
	}


	MessageCreate(message: Message, fromSelf: boolean, botMentioned: boolean): void {
		if (fromSelf) return
		if (message.author.bot) return // dont level up bots
		let leveledUp = this.AddXp(message, this.data.MessageXp)
		if (leveledUp) {
			if (this.levelUpChannel) {
				this.levelUpChannel.send(`Conrats <@${message.author.id}>! You've reached level ${this.data.Levels[message.author.id]?.level}!`)
			} else {
				message.reply({
					content: `You've leveled up! You are now level ${this.data.Levels[message.author.id]?.level}!`,
				})
			}
		}
	}

	ForumPostCreated(thread: AnyThreadChannel, forum: ForumChannel): void {
		
	}
}