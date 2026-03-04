import Module from "./Module";
import path from "path";
import fs from "fs";
import { Client } from "discord.js";

export default abstract class EntangledModule<Data> extends Module {
	data: Data

	get saveDirectory(): string {
		return path.join(process.cwd(), "data")
	}

	get saveFilePath(): string {
		return path.join(this.saveDirectory, `${this.constructor.name}.json`)
	}

	LoadData(): [Data, boolean] {
		// Ensure data directory exists
		if (!fs.existsSync(this.saveDirectory)) {
			fs.mkdirSync(this.saveDirectory, { recursive: true })
		}

		// If save file exists, load it
		if (fs.existsSync(this.saveFilePath)) {
			try {
				const raw = fs.readFileSync(this.saveFilePath, "utf-8")
				return [JSON.parse(raw) as Data, true]
			} catch (err) {
				console.error(
					`Failed to load data for ${this.constructor.name}:`,
					err
				)
				return [this.NewData(), true]
			}
		} else {
			// No file yet → initialize empty
			return [this.NewData(), false]
		}
	}

	SaveData(): void {
		try {
			// Ensure directory exists before saving
			if (!fs.existsSync(this.saveDirectory)) {
				fs.mkdirSync(this.saveDirectory, { recursive: true })
			}

			fs.writeFileSync(
				this.saveFilePath,
				JSON.stringify(this.data, null, 2),
				"utf-8"
			)
		} catch (err) {
			console.error(
				`Failed to save data for ${this.constructor.name}:`,
				err
			)
		}
	}

	abstract NewData(): Data

	constructor(client: Client) {
		super(client)
		let details = this.LoadData()
		this.data = details[0]
		if (!details[1]) {
			// New file created, should save!
			this.SaveData()
		}
	}
}