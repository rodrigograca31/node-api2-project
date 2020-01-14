const express = require("express");
const Posts = require("./model");

const router = express.Router(); // "/api/posts"

router.get("/", (req, res) => {
	Posts.find(req.query)
		.then(posts => {
			if (posts) {
				res.status(200).json(posts);
			} else {
				res.status(404).json({ message: "not found" });
			}
		})
		.catch(error => {
			res.status(500).json({ message: "error finding posts" });
		});
});

router.post("/", (req, res) => {});

module.exports = router;
