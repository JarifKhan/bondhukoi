"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";

const Page = () => {
  const { id } = useParams(); // Destructure `id` directly for simplicity
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        if (!id) {
          console.log("Invalid faculty ID",id);
          throw new Error("Invalid faculty ID");
        }

        const response = await fetch(`/api/faculty/${id}`);
        console.log("api info", response)
        if (!response.ok) {
          console.log("Faculty not found");
          throw new Error("Faculty not found");
        }

        const faculty = await response.json();
        console.log("Faculty data fetched:", faculty);
        setData(faculty);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        notFound(); // Trigger 404 if faculty not found
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, [id]);

  if (loading) {
    console.log("Loading state:", data);
    return (
      <div className="text-center p-6">
        <p className="text-lg text-gray-700">Loading faculty data...</p>
      </div>
    );
  }

  if (!data) {
    console.log("Faculty data not found:", data);
    return (
      <div className="text-center p-6">
        <p className="text-lg text-gray-700">Faculty not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row bg-white shadow-md rounded-lg overflow-hidden">
        <div className="relative w-full lg:w-1/3 h-64 lg:h-auto">
          <Image
            src={data.image || "/default-image.jpg"}
            alt={`${data.title || "Faculty"} Profile Picture`}
            width={500}
            height={500}
            className="object-cover object-center w-full h-full"
          />
        </div>
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800">{data.title || "No Title"}</h1>
          <p className="text-sm text-gray-600 mb-4">{data.category || "No Category"}</p>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">About</h2>
            <p className="text-gray-700">{data.bio || "Bio not available."}</p>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Research Interests
            </h2>
            {data.researchInterests?.length > 0 ? (
              <ul className="list-disc ml-6 text-gray-700">
                {data.researchInterests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No research interests listed.</p>
            )}
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Contact Information
            </h2>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {data.email || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Phone:</span> {data.phone || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Office:</span> {data.office || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
