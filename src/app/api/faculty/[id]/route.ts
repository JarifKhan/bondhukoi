import connectToDatabase from "@/libs/mongodb";
import Faculty from "@/models/Faculty";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  await connectToDatabase();
  try {
    const  {id}  = await context.params;


    if (!id) {
      return new Response("Invalid faculty ID", { status: 400 });
    }

    
    

    // Query the database for the faculty document
    const faculty = await Faculty.findOne({ id:id });

    if (!faculty) {
      return new Response("Faculty not found", { status: 404 });
    }

    // Return the faculty data as a JSON response
    return new Response(JSON.stringify(faculty), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching faculty data:", error);
    return new Response("Server Error", { status: 500 });
  }
}
