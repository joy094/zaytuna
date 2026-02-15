import mongoose from "mongoose";
import colors from "colors";
const connectDB = async () => {
  try {
    const data_base_conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `DB is connected ${data_base_conn.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`some error in DB ${error}`.bgRed.white);
  }
};

export default connectDB;
