const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId:{
        type: String,
        ref: 'User',
      },
    taskName: {
        type: String,
        required: true
    },
    dueOn: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['TO-DO', 'IN-PROGRESS', 'COMPLETED']
    },
    category: {
        type: String,
        required: true,
        enum: ['work', 'personal']
    },
    description: {
        type: String,
    },
    fileLinks: {
        type: [String],
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
