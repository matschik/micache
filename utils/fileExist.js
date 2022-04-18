import fs from 'fs/promises';

export default async function fileExist(path) {
	try {
		await fs.access(path);
	} catch {
		return false;
	}
	return true;
}