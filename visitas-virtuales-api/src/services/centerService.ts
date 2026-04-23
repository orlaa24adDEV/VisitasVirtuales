import { db } from '../db/db.ts'
import { type Center, centers } from '../db/schema.ts'

const getAllCenters: () => Promise<Center[]> = async () => {
	const centerArr: Center[] = await db
		.select({
			id: centers.id,
			name: centers.name,
			description: centers.description,
			location: centers.location,
		})
		.from(centers)

	return centerArr
}

export default {
	getAllCenters,
}
