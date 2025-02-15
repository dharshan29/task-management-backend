const mongoose = require('mongoose');

const options = {
  autoIndex: false, // Don't build indexes automatically
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

mongoose.connect(process.env.MONGODB_URL, options)
  .then(() => console.log('------------------Connected to Database----------------'))
  .catch((error) => console.log(`-------------- ${error} ----------------`));

const db = mongoose.connection;
db.on('error', (error) => console.log(`-------------- ${error} ----------------`));