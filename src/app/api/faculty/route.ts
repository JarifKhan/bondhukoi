import connectToDatabase from "@/libs/mongodb";
import Faculty from "@/models/Faculty";

// Handle GET requests
export async function GET() {
  await connectToDatabase();
  try {
    const facultyList = await Faculty.find({});
    return new Response(JSON.stringify(facultyList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching data", error }), { status: 500 });
  }
}

// Handle POST requests
export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const newFaculty = await Faculty.create(body);
    return new Response(JSON.stringify(newFaculty), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error creating faculty", error }), { status: 400 });
  }
}
