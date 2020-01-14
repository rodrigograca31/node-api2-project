const express = require("express");
const Posts = require("../../data/db");

const router = express.Router(); // "/api/posts"

router.get("/", (req, res) => {
	Posts.find()
		.then(posts => {
			console.log(posts);

			if (posts) {
				res.status(200).json(posts);
			} else {
				res.status(404).json({ message: "not found" });
			}
		})
		.catch(error => {
			console.log(error);
			res.status(500).json({
				message: "The posts information could not be retrieved."
			});
		});
});
router.get("/:id", (req, res) => {
	Posts.findById(req.params.id)
		.then(posts => {
			if (posts.length !== 0) {
				res.status(200).json(posts);
			} else {
				res.status(404).json({
					message: "The post with the specified ID does not exist."
				});
			}
		})
		.catch(error => {
			console.log(error);
			res.status(500).json({
				message: "The post information could not be retrieved."
			});
		});
});

router.post("/", (req, res) => {
	if (!(req.body && req.body.title && req.body.contents)) {
		res.status(400).json({
			message: "Please provide title and contents for the post."
		});
		return true;
	}

	Posts.add(req.body)
		.then(post => {
			if (post) {
				res.status(201).json(post);
			}
		})
		.catch(error => {
			res.status(500).json({
				message:
					"There was an error while saving the post to the database"
			});
		});
});

router.get("/:id/comments", (req, res) => {
	Posts.findById(req.params.id)
		.then(posts => {
			if (posts.length !== 0) {
				Posts.findPostComments(req.params.id)
					.then(comments => {
						res.status(200).json(comments);
					})
					.catch(err => {
						res.status(500).json({
							message:
								"The comments information could not be retrieved."
						});
					});
			} else {
				res.status(404).json({
					message: "The post with the specified ID does not exist."
				});
			}
		})
		.catch(error => {
			console.log(error);
			res.status(500).json({
				message: "The post information could not be retrieved."
			});
		});
});

router.post("/:id/comments", (req, res) => {
	if (
		!(
			req.body &&
			req.body.text &&
			req.body.text.length !== 0 &&
			typeof req.body.text === "string"
		)
	) {
		res.status(400).json({
			message: "Please provide text for the comment."
		});
		return true;
	}

	Posts.findById(req.params.id)
		.then(result => {
			if (result) {
				Posts.insertComment({
					text: req.body.text,
					post_id: req.params.id
				})
					.then(result => {
						res.status(201).json({ ...result, ...req.body });
					})
					.catch(err => {
						res.status(404).json({
							message:
								"There was an error while saving the comment to the database"
						});
					});
			} else {
				res.status(404).json({
					message: "The post with the specified ID does not exist."
				});
			}
		})
		.catch(err => {
			res.status(500).json({
				message: "Error"
			});
		});
});

router.put("/:id", (req, res) => {
	if (!(req.body && req.body.title && req.body.contents)) {
		res.status(400).json({
			errorMessage: "Please provide title and contents for the post."
		});
		return true;
	}

	Posts.findById(req.params.id)
		.then(result => {
			if (result.length !== 0) {
				console.log(result);

				Posts.update(req.params.id, req.body)
					.then(result2 => {
						res.status(200).json({ ...result[0], ...req.body });
					})
					.catch(err => {
						res.status(500).json({
							message:
								"The post information could not be modified."
						});
					});
			} else {
				res.status(404).json({
					message: "The post with the specified ID does not exist."
				});
			}
		})
		.catch(err => {
			res.status(500).json({
				message: "The post information could not be modified."
			});
		});
});

router.delete("/:id", (req, res) => {
	Posts.findById(req.params.id)
		.then(result => {
			if (result.length !== 0) {
				console.log(result);

				Posts.remove(result[0].id)
					.then(result2 => {
						res.status(200).json({ message: "ok" });
					})
					.catch(err => {
						res.status(500).json({
							message: "The post could not be removed"
						});
					});
			} else {
				res.status(404).json({
					message: "The post with the specified ID does not exist."
				});
			}
		})
		.catch(err => {
			res.status(500).json({
				message: "The post could not be removed"
			});
		});
});

module.exports = router;
