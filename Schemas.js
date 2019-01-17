const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema2 = new Schema({
  username: { type: String, unique: true, required: true },
  // exercises: [{type: Schema.Types.ObjectId, ref: 'Exercise' }]
})
 
const ExerciseSchema2 = new Schema({
  // user: { type: Schema.Types.ObjectId, ref: 'User' },
  user: String,
  description: String,
  duration: Number,
  date: Date
});

mongoose.model("User2", UserSchema2);
mongoose.model("Exercise2", ExerciseSchema2);
