"use server";
import connectToDatabase from "@/libs/mongodb";
import User from "@/models/User";

export async function createUser(user: any) {
    try{
        await connectToDatabase();
        const newUser= await User.create(user);
        return JSON.parse(JSON.stringify(newUser));

    }catch(error){
        console.log(error)
    }
}

