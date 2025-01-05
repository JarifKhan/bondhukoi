import Schedule from "@/models/Schedule";
import User from "@/models/User";
import connectToDatabase from "@/libs/mongodb";
import { currentUser } from "@clerk/nextjs/server";

// POST: Add a routine to the schedule
export async function POST(req: Request): Promise<Response> {
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

	const body = await req.json();
	const { day, startTime, endTime } = body;

	if (!day || !startTime || !endTime) {
		return new Response(
			JSON.stringify({ message: "All routine fields are required" }),
			{ status: 400 }
		);
	}

	// Find the user's schedule or create a new one
	let schedule = await Schedule.findOne({ user: dbUser._id });

	if (!schedule) {
		schedule = new Schedule({ user: dbUser._id, routine: [] });
	}

	// Add the new routine
	schedule.routine.push({ day, startTime, endTime });
	await schedule.save();

	return new Response(
		JSON.stringify({ message: "Routine added successfully", schedule }),
		{ status: 201 }
	);
}

// GET: Get the schedule of the current user
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

	let schedule = await Schedule.findOne({ user: dbUser._id });
	if (!schedule) {
		schedule = new Schedule({ user: dbUser._id, routine: [] });
		await schedule.save();
	}

	if (!schedule) {
		return new Response(
			JSON.stringify({ message: "No schedule found for this user" }),
			{ status: 404 }
		);
	}

	return new Response(JSON.stringify(schedule), { status: 200 });
}

export async function PUT(): Promise<Response> {
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

	const schedule = await Schedule.findOne({ user: dbUser._id });

	if (!schedule) {
		return new Response(
			JSON.stringify({ message: "No schedule found for this user" }),
			{ status: 404 }
		);
	}

	// Toggle the public field
	schedule.public = !schedule.public;
	await schedule.save();

	return new Response(
		JSON.stringify({
			message: "Public field toggled successfully",
			schedule,
		}),
		{ status: 200 }
	);
}

// DELETE: Remove a routine from the schedule
export async function DELETE(req: Request): Promise<Response> {
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

	const body = await req.json();
	const { routineId } = body;

	if (!routineId) {
		return new Response(
			JSON.stringify({ message: "Routine ID is required" }),
			{ status: 400 }
		);
	}

	const schedule = await Schedule.findOne({ user: dbUser._id });

	if (!schedule) {
		return new Response(
			JSON.stringify({ message: "No schedule found for this user" }),
			{ status: 404 }
		);
	}

	// Remove the routine
	const routineIndex = schedule.routine.findIndex(
		(routine: any) => routine._id.toString() === routineId
	);

	if (routineIndex === -1) {
		return new Response(JSON.stringify({ message: "Routine not found" }), {
			status: 404,
		});
	}

	schedule.routine.splice(routineIndex, 1);
	await schedule.save();

	return new Response(
		JSON.stringify({ message: "Routine deleted successfully", schedule }),
		{ status: 200 }
	);
}
