const knex = require("knex");
const config = require("../../knexfile.js");
const db = knex(config.development);

// const table = db("posts");

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

	let rows = db("posts")
		.orderBy(sortby, sortdir)
		.limit(limit)
		.offset(offset);

	return rows;
}

function findById(id) {
	return db("posts")
		.where({ id })
		.first();
}

async function add(hub) {
	const [id] = await db("posts").insert(hub);
	console.log(id);

	return findById(id);
}

function remove(id) {
	return db("posts")
		.where({ id })
		.del();
}

function update(id, changes) {
	return db("posts")
		.where({ id })
		.update(changes, "*");
}

function findPostComments(id) {
	return db("posts")
		.where({ id })
		.first();
}
