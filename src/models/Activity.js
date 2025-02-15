const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task', // Reference to the Task model
        required: true
    },
    activity: {
        type: String,
        required: true
    }
}, {
    timestamps: true 
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
