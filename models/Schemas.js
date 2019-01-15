const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  exercise: [
    {
      description: String,
      duration: Number,
      date: Date
    }
  ]
});

// const ExerciseSchema = new Schema({
//   user: { type: Schema.Types.ObjectId, ref: "User" }
// });

mongoose.model("User", UserSchema);
// mongoose.model("Exercise", ExerciseSchema);
