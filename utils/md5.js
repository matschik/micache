import crypto from 'crypto';

export default async function md5(data) {
	return crypto.createHash('md5').update(data).digest('hex');
}