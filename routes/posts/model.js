const knex = require("knex");
const config = require("../../knexfile.js");
const db = knex(config.development);

const table = db("posts");

module.exports = {
	find,
	findById,
	add,
	remove,
	update
};

function find(query) {
	const { page = 1, limit = 2, sortby = "id", sortdir = "asc" } = query;
	const offset = limit * (page - 1);

	let rows = table
		.orderBy(sortby, sortdir)
		.limit(limit)
		.offset(offset);

	return rows;
}

function findById(id) {
	return table.where({ id }).first();
}

async function add(hub) {
	const [id] = await table.insert(hub);

	return findById(id);
}

function remove(id) {
	return table.where({ id }).del();
}

function update(id, changes) {
	return table.where({ id }).update(changes, "*");
}
