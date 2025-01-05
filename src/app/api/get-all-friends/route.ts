import mongoose from "mongoose";
import Friend from "@/models/Friend";
import User from "@/models/User";
import connectToDatabase from "@/libs/mongodb";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request): Promise<Response> {
	await connectToDatabase();

	const user = await currentUser();
	if (!user) {
		return new Response(JSON.stringify({ message: "Unauthorized" }), {
			status: 401,
		});
	}

	const dbUser = await User.findOne({ clerkId: user.id });
	if (!dbUser) {
		return new Response(
			JSON.stringify({ message: "User not found in database" }),
			{ status: 404 }
		);
	}

	const friends = await Friend.find({
		$or: [
			{ user: dbUser._id, status: "accepted" },
			{ friend: dbUser._id, status: "accepted" },
		],
	})
		.populate("friend")
		.populate("user");

	return new Response(JSON.stringify(friends), { status: 200 });
}
