import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // যার কাছে নোটিফিকেশন যাবে (ইউজার)
  forAdmin: { type: Boolean, default: false }, // নোটিফিকেশনটি কি সকল অ্যাডমিনদের জন্য?
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: { type: String } // নোটিফিকেশনে ক্লিক করলে কোথায় যাবে
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;