const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	console.log(req.header("Authorization")?.replace("Bearer ", ""))
	try {
		const token = req.header("Authorization")?.replace("Bearer ", "");
		if (!token) {
			return res.status(401).send({ error: "Unauthorized", message: "Authorization header is missing" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	}
	catch (error) {
		console.log("JWT verification error:", error);
		res.status(401).send({ error: "Unauthorized", message: "Invalid token" });
	}
};

module.exports = verifyToken;
