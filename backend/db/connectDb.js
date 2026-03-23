import mongoose from 'mongoose'
export const connectDb = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongodb is connected : ${conn.connection.host}`)
    }catch (error) {
  console.log("❌ RAW ERROR:");
  console.log(error);
  console.log("❌ RESPONSE DATA:");
  console.log(error?.response?.data);
  console.log("❌ MESSAGE:");
  console.log(error?.message);

  throw error; // 👈 IMPORTANT: don't wrap it, just throw original
}
}