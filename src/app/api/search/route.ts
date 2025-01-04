import User from "@/models/User";
import connectToDatabase from "@/libs/mongodb";

// Handle GET requests
export async function GET(req: Request) {
  const  s  = req.url.split('=')[1];
   // Get query parameter from URL


  if (!s || s.trim() === '') {
    return new Response(JSON.stringify([]), { status: 400 });
  }

  try {
    await connectToDatabase();

        const person = await User.findOne({ username:s });
        return new Response(JSON.stringify(person), { status: 200 });

    return new Response(JSON.stringify(person), { status: 200 });
  } catch (error) {
    console.error("Error searching for users:", error);
    return new Response(
      JSON.stringify({ message: "Error searching for users", error }),
      { status: 500 }
    );
  }
}

// Handle POST requests (optional, for creating new users)
export async function POST(req:Request) {
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
