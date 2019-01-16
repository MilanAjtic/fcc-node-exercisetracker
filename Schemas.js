const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  exercises: [{type: Schema.Types.ObjectId, ref: 'Exercise' }]
})
 
const ExerciseSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  description: String,
  duration: Number,
  date: Date
});

mongoose.model("User", UserSchema);
mongoose.model("Exercise", ExerciseSchema);
