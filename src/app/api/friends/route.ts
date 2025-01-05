import mongoose from "mongoose";
import Friend from "@/models/Friend";
import User from "@/models/User";
import connectToDatabase from "@/libs/mongodb";
import { currentUser } from "@clerk/nextjs/server";

// Define the request body types
interface SendFriendRequestBody {
	friendId: string;
}

interface AcceptFriendRequestBody {
	requestId: string;
}

// POST: Send a new friend request
export async function POST(req: Request): Promise<Response> {
	await connectToDatabase();

	const user = await currentUser();
	if (!user) {
		return new Response(JSON.stringify({ message: "Unauthorized" }), {
			status: 401,
		});
	}

	// Get the database user using Clerk ID
	const dbUser = await User.findOne({ clerkId: user.id });
	if (!dbUser) {
		return new Response(
			JSON.stringify({ message: "User not found in database" }),
			{ status: 404 }
		);
	}

	const body = await req.json();
	const { friendId } = body as SendFriendRequestBody;

	if (!friendId) {
		return new Response(
			JSON.stringify({ message: "Friend ID is required" }),
			{ status: 400 }
		);
	}

	const newFriendRequest = new Friend({
		user: dbUser._id,
		friend: new mongoose.Types.ObjectId(friendId),
		status: "pending",
	});

	await newFriendRequest.save();

	return new Response(
		JSON.stringify({ message: "Friend request sent successfully" }),
		{ status: 201 }
	);
}

// GET: Get all pending friend requests
export async function GET(req: Request): Promise<Response> {
	await connectToDatabase();

	const user = await currentUser();
	if (!user) {
		return new Response(JSON.stringify({ message: "Unauthorized" }), {
			status: 401,
		});
	}

	// Get the database user using Clerk ID
	const dbUser = await User.findOne({ clerkId: user.id });
	if (!dbUser) {
		return new Response(
			JSON.stringify({ message: "User not found in database" }),
			{ status: 404 }
		);
	}

	const pendingRequests = await Friend.find({
		friend: dbUser._id,
		status: "pending",
	}).populate("user"); // Adjust the fields based on your User schema

	return new Response(JSON.stringify(pendingRequests), { status: 200 });
}

// PUT: Accept a friend request
export async function PUT(req: Request): Promise<Response> {
	await connectToDatabase();

	const user = await currentUser();
	if (!user) {
		return new Response(JSON.stringify({ message: "Unauthorized" }), {
			status: 401,
		});
	}

	// Get the database user using Clerk ID
	const dbUser = await User.findOne({ clerkId: user.id });
	if (!dbUser) {
		return new Response(
			JSON.stringify({ message: "User not found in database" }),
			{ status: 404 }
		);
	}

	const body = await req.json();
	const { requestId } = body as AcceptFriendRequestBody;

	if (!requestId) {
		return new Response(
			JSON.stringify({ message: "Request ID is required" }),
			{ status: 400 }
		);
	}

	const friendRequest = await Friend.findOne({
		_id: new mongoose.Types.ObjectId(requestId),
		friend: dbUser._id,
		status: "pending",
	});

	if (!friendRequest) {
		return new Response(
			JSON.stringify({
				message: "Friend request not found or already processed",
			}),
			{ status: 404 }
		);
	}

	friendRequest.status = "accepted";
	friendRequest.updated_at = new Date();
	await friendRequest.save();

	return new Response(
		JSON.stringify({ message: "Friend request accepted" }),
		{ status: 200 }
	);
}

interface DeleteFriendRequestBody {
	friendId: string;
}

// DELETE: Remove a friend
export async function DELETE(req: Request): Promise<Response> {
	await connectToDatabase();

	const user = await currentUser();
	if (!user) {
		return new Response(JSON.stringify({ message: "Unauthorized" }), {
			status: 401,
		});
	}

	// Get the database user using Clerk ID
	const dbUser = await User.findOne({ clerkId: user.id });
	if (!dbUser) {
		return new Response(
			JSON.stringify({ message: "User not found in database" }),
			{ status: 404 }
		);
	}

	const body = await req.json();
	const { friendId } = body as DeleteFriendRequestBody;

	if (!friendId) {
		return new Response(
			JSON.stringify({ message: "Friend ID is required" }),
			{ status: 400 }
		);
	}

	console.log(friendId);

	// Find and delete the friendship
	const friendRecord = await Friend.findByIdAndDelete(friendId);

	if (!friendRecord) {
		return new Response(
			JSON.stringify({
				message: "Friendship not found or already deleted",
			}),
			{ status: 404 }
		);
	}

	return new Response(
		JSON.stringify({ message: "Friendship deleted successfully" }),
		{ status: 200 }
	);
}
