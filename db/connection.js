import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const mongoURI = process.env.DB_URL;

 const connectDB = async () => {
    try {
        await connect(mongoURI);
        console.log('Connected to database successfully');
    } catch (error) {
        console.log('Error connecting to database:', error);
    }
};

export default connectDB;