import Module from "./Module";
import path from "path";
import fs from "fs";

export default abstract class EntangledModule<Data> extends Module {
	data: Data | null = null

	get saveDirectory(): string {
		return path.join(process.cwd(), "data")
	}

	get saveFilePath(): string {
		return path.join(this.saveDirectory, `${this.constructor.name}.json`)
	}

	Load(): void {
		super.Load()

		// Ensure data directory exists
		if (!fs.existsSync(this.saveDirectory)) {
			fs.mkdirSync(this.saveDirectory, { recursive: true })
		}

		// If save file exists, load it
		if (fs.existsSync(this.saveFilePath)) {
			try {
				const raw = fs.readFileSync(this.saveFilePath, "utf-8")
				this.data = JSON.parse(raw) as Data
			} catch (err) {
				console.error(
					`Failed to load data for ${this.constructor.name}:`,
					err
				)
				this.data = this.NewData()
			}
		} else {
			// No file yet → initialize empty
			this.data = this.NewData()
			this.SaveData() // save data to create editable file immediately
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

	Cleanup(): void {
		this.SaveData()
	}

	abstract NewData(): Data
}