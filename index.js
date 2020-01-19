const express = require("express");
const server = express();
const postsRouter = require("./routes/posts/router");
const cors = require("cors");

server.use(express.json());
server.use(cors());
server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
	res.send("API RUNNING SMOOTHLY");
});

server.listen(4000, () => {
	console.log("\n*** Server Running on http://localhost:4000 ***\n");
});
