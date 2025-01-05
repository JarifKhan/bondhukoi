import User from "@/models/User";
import connectToDatabase from "@/libs/mongodb";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(): Promise<Response> {
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
	return new Response(JSON.stringify(dbUser), { status: 200 });
}
