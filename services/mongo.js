const mongoose = require('mongoose');

mongoose.Promise = Promise;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: false,
};

mongoose.connect(process.env.MONGODB, options);

const { connection } = mongoose;

connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
