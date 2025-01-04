"use client";

import React, { useEffect, useState } from "react";
import FacultyCart from "@/app/faculty/FacultyCart";

// Define the type for the faculty data
interface Faculty {
  id: string;
  image: string;
  title: string;
  bio: string;
  category: string;
}

const FacultyList = () => {
  const [filter, setFilter] = useState("All");
  const [facultyData, setFacultyData] = useState<Faculty[]>([]); // Specify the type of facultyData

  // Fetch faculty data from the API
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const res = await fetch("/api/faculty");
        if (!res.ok) {
          throw new Error("Failed to fetch faculty data");
        }
        const data: Faculty[] = await res.json(); // Ensure the fetched data matches the Faculty type
        setFacultyData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFacultyData();
  }, []);

  return (
    <div>
      <div className="flex justify-center gap-6 my-10">
        <button onClick={() => setFilter("All")} className={filter === "All" ? "bg-black text-white py-1 px-4 rounded-sm" : ""}>All</button>
        <button onClick={() => setFilter("Professor")} className={filter === "Professor" ? "bg-black text-white py-1 px-4 rounded-sm" : ""}>Professors</button>
        <button onClick={() => setFilter("Associate Professor")} className={filter === "Associate Professor" ? "bg-black text-white py-1 px-4 rounded-sm" : ""}>Associate Professors</button>
        <button onClick={() => setFilter("Assistant Professor")} className={filter === "Assistant Professor" ? "bg-black text-white py-1 px-4 rounded-sm" : ""}>Assistant Professors</button>
        <button onClick={() => setFilter("Senior Lecturer")} className={filter === "Senior Lecturer" ? "bg-black text-white py-1 px-4 rounded-sm" : ""}>Senior Lecturers</button>
        <button onClick={() => setFilter("Lecturer")} className={filter === "Lecturer" ? "bg-black text-white py-1 px-4 rounded-sm" : ""}>Lecturer</button>
      </div>
      
      <div className="flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24">
        {facultyData
          .filter((item) => filter === "All" || item.category === filter)
          .map((item, index) => {
            return (
              <FacultyCart
                key={index}
                id={item.id}
                image={item.image}
                title={item.title}
                description={item.bio}
                category={item.category}
              />
            );
          })}
      </div>
    </div>
  );
};

export default FacultyList;
