import connectToDatabase from "@/libs/mongodb";
import User from "@/models/User";

// Handle GET requests
export async function GET() {
  await connectToDatabase();
  try {
    const userList = await User.find({});
    return new Response(JSON.stringify(userList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching data", error }), { status: 500 });
  }
}

// Handle POST requests
export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const newUser = await User.create(body);
    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error creating faculty", error }), { status: 400 });
  }
}
