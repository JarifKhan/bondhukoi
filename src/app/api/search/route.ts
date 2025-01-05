import User from "@/models/User";
import Friend from "@/models/Friend";
import connectToDatabase from "@/libs/mongodb";
import { currentUser } from "@clerk/nextjs/server";

// Handle GET requests
export async function GET(req: Request) {
	const s = req.url.split("=")[1];
	// Get query parameter from URL

	if (!s || s.trim() === "") {
		return new Response(JSON.stringify([]), { status: 400 });
	}

	try {
		await connectToDatabase();

		const user = await currentUser();
		if (!user) {
			return new Response(JSON.stringify({ message: "Unauthorized" }), {
				status: 401,
			});
		}

		// Search for users in the database

		const dbUser = await User.findOne({ clerkId: user.id });

		if (!dbUser) {
			return new Response(
				JSON.stringify({ message: "User not found in database" }),
				{ status: 404 }
			);
		}

		const users = await User.find({
			$or: [
				{ clerkId: { $regex: s, $options: "i" } },
				{ email: { $regex: s, $options: "i" } },
				{ username: { $regex: s, $options: "i" } },
				{ firstname: { $regex: s, $options: "i" } },
				{ lastname: { $regex: s, $options: "i" } },
				{ photo: { $regex: s, $options: "i" } },
			],
			_id: { $ne: dbUser._id },
		});

		const usersWithFriendStatus = await Promise.all(
			users.map(async (user) => {
				const friendStatus = await Friend.findOne({
					$or: [
						{ user: dbUser._id, friend: user._id },
						{ user: user._id, friend: dbUser._id },
					],
				});

				let status = "not friend";
				if (friendStatus) {
					status =
						friendStatus.status === "accepted"
							? "friend"
							: "pending";
				}

				return {
					...user.toObject(),
					friendStatus: status,
				};
			})
		);

		return new Response(JSON.stringify(usersWithFriendStatus), {
			status: 200,
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ message: "Error searching for users", error }),
			{ status: 500 }
		);
	}
}

// Handle POST requests (optional, for creating new users)
export async function POST(req: Request) {
	await connectToDatabase();

	try {
		const body = await req.json(); // Parse the incoming request body
		const newUser = await User.create(body); // Create a new user in the database
		return new Response(JSON.stringify(newUser), { status: 201 });
	} catch (error) {
		console.error("Error creating user:", error);
		return new Response(
			JSON.stringify({ message: "Error creating user", error }),
			{ status: 400 }
		);
	}
}
