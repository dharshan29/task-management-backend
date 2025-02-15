const express = require('express');
const Task = require('../models/Task'); // Adjust the path as needed
const Activity = require('../models/Activity');

const addTask = async (req, res) => {
    const userId = req.user.userId;
    try {
        const { taskName, dueOn, status, category, description = '', fileLinks = [] } = req.body;

        if (!taskName || !dueOn || !status || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const task = new Task({userId, taskName, dueOn, status, category, description, fileLinks });
        await task.save();

        await Activity.create({ taskId: task._id, activity: "You created this task." });

        res.status(201).json({ message: "Task added successfully",task });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


const getTasks = async (req, res) => {
    const userId = req.user.userId;
   
    try {
        let { search = '', category, dueOnStart, dueOnEnd, sort = 'asc' } = req.query;

        let filter = { userId };

        // Search by taskName
        if (search) {
            filter.taskName = { $regex: search, $options: 'i' };
        }

        // Filter by category, ignoring empty strings or spaces
        if (category && category.trim() !== '') {
            filter.category = category.trim();
        }

        // Filter by dueOn range
        if (dueOnStart && dueOnEnd) {
            filter.dueOn = { 
                $gte: new Date(dueOnStart), 
                $lte: new Date(dueOnEnd) 
            };
        }

        // Sorting by dueOn 
        let sortOrder = sort === 'desc' ? -1 : 1;

        const tasks = await Task.find(filter).sort({ dueOn: sortOrder });

        res.json({tasks});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const { _id, taskName, dueOn, status, category, description = '', fileLinks = [] } = req.body;

        if (!_id) {
            return res.status(400).json({ error: 'Task ID (_id) is required for updating' });
        }

        const existingTask = await Task.findById(_id);
        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        let activityLogs = [];

        if (existingTask.taskName !== taskName) {
            activityLogs.push(`You updated the task name from "${existingTask.taskName}" to "${taskName}".`);
        }

        if (fileLinks.length > existingTask.fileLinks.length) {
            activityLogs.push("You uploaded a new file.");
        } else if (fileLinks.length < existingTask.fileLinks.length) {
            activityLogs.push("You removed a file.");
        }

        if (activityLogs.length === 0) {
            activityLogs.push("You updated this task.");
        }

        const updatedTask = await Task.findByIdAndUpdate(
            _id,
            { taskName, dueOn, status, category, description, fileLinks },
            { new: true }
        );

        await Activity.insertMany(activityLogs.map(log => ({ taskId: _id, activity: log })));

        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};



const deleteTasks = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Invalid or empty IDs array' });
        }

        const result = await Task.deleteMany({ _id: { $in: ids } });

        return res.json({ deletedIds: ids, deletedCount: result.deletedCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { ids, status } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Invalid or missing task IDs' });
        }
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const tasks = await Task.find({ _id: { $in: ids } });

        let activityLogs = tasks.map(task => ({
            taskId: task._id,
            activity: `You changed status from "${task.status}" to "${status}".`
        }));

        const result = await Task.updateMany(
            { _id: { $in: ids } }, 
            { $set: { status } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'No tasks updated' });
        }

        await Activity.insertMany(activityLogs);

        res.status(200).json({ message: 'Task statuses updated successfully', ids, status });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }

};

const getActivities = async (req, res) => {
    try {
        const { taskId } = req.params;
        console.log(req.params)

        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }

        const activities = await Activity.find({ taskId }).sort({ createdAt: -1 });

        res.status(200).json({ activities });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

module.exports = {
    addTask, getTasks, updateTask, deleteTasks, updateTaskStatus, getActivities
};