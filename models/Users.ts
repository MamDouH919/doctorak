import mongoose from "mongoose";


const UsersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, default: "" },
  password: { type: String, required: true },
  verified: { type: Boolean, required: true, default: false },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
    default: "user"
  },
  otp: { type: String, required: false, default: "" },
  token: { type: String, required: false, default: "" },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Accounts' },
  image: { type: String, required: true, default: "" },
  active: { type: Boolean, default: false },
  phone: { type: String, default: "" },
}, {
  timestamps: true,
  versionKey: false,
});

// Export the model
const Users = mongoose.models?.Users || mongoose.model("Users", UsersSchema);

export default Users;
