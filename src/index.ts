import { GatewayIntentBits } from "discord.js";
import ModuleClient from "./ModuleSystem/ModuleClient";
import path from "path";
import { StatusModule } from "./Modules/StatusModule";
import { CharacterChatModule } from "./Modules/CharacterChatModule";
import { ShutdownModule } from "./Modules/ShutdownModule";
import LevelModule from "./Modules/LevelModule";

var client = new ModuleClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages
	]
}, [
	StatusModule,
	CharacterChatModule,
	ShutdownModule,
	LevelModule
])

var tokenConfig: { token: string } = require(path.join(process.cwd(), "data", "secret", "token.json"))

client.Setup(tokenConfig.token)
client.Cleanup()