function get(name){
	return localStorage.getItem(name) || null;
}

function set(name, value){
	return localStorage.setItem(name, value);
}

function clear(name){
	return localStorage.removeItem(name);
}

module.exports = {
	get: get,
	set: set,
	clear: clear
};