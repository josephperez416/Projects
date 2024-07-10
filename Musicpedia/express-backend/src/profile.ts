import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  gmail: string;
  password: string;

}

const profileSchema: Schema = new Schema({
  gmail: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },

});

export default mongoose.model<IProfile>('Profile', profileSchema);
