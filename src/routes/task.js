const express = require("express");
const router = express.Router();
const { addTask, getTasks, deleteTasks, updateTask, updateTaskStatus, getActivities } = require("../controllers/task");
const verifyToken = require("../config/jwt");

router.post('/task/addtask', verifyToken, addTask)
router.get('/task/getTasks', verifyToken, getTasks)
router.post('/task/updateTask' , verifyToken, updateTask)
router.post('/task/deleteTasks' , verifyToken, deleteTasks)
router.post('/task/updateTaskStatus' , verifyToken, updateTaskStatus)
router.get('/tasks/:taskId/activities', verifyToken, getActivities);

module.exports = router;