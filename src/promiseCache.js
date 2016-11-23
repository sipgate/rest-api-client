const cache = {};

export default {
	get(key) {
		return cache[key];
	},
	set(key, value) {
		cache[key] = value;
	},
	bust(key) {
		delete cache[key];
	},
};
