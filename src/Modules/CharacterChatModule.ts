import EntangledModule from "../ModuleSystem/EntangledModule";

export interface IChat {
	host: string
	thread: string
	modelId: number
}

export interface ICharacterChatConfig {
	chatChannel: string
	chats: IChat[]
}

export class CharacterChatModule extends EntangledModule<ICharacterChatConfig> {
	NewData(): ICharacterChatConfig {
		return {
			chatChannel: "PLACE_SNOWFLAKE_HERE",
			chats: []
		}
	}
}