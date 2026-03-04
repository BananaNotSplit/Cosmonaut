import { Message, Snowflake } from "discord.js"
import EntangledModule from "../ModuleSystem/EntangledModule"

export interface ILevelModuleConfig {
	LevelUpScalar: number
	MessageXp: number

	Levels: {[user: Snowflake]: {level: number, xp: number}}
}

function XpForEachLevel(level: number, scalar: number): number {
	if (level <= 0) return 0
	return (scalar * level * (level + 1)) / 2
} // uhh chatgpt im just gonna trust you :sob: it works tho (tested it)

export default class LevelModule extends EntangledModule<ILevelModuleConfig> {
	NewData(): ILevelModuleConfig {
		return {
			LevelUpScalar: 10,
			MessageXp: 1,
			Levels: {}
		}
	}

	AddXp(source: Message): boolean {
		var record = this.data.Levels[source.author.id]
		if (!record) {
			record = { level: 0, xp: 0 }
			this.data.Levels[source.author.id] = record // set the property for saving!
		}

		record.xp += this.data.MessageXp
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
		let leveledUp = this.AddXp(message)
		if (leveledUp) {
			message.reply({
				content: `You've leveled up! You are now level ${this.data.Levels[message.author.id]?.level}!`,
			})
		}
	}
}