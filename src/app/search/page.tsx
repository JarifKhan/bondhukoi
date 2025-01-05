"use client";

import { useEffect, useState } from "react";

interface User {
	_id: string;
	clerkId: string;
	email: string;
	username: string;
	photo: string | null;
	firstname: string;
	lastname: string;
	friendStatus: string; // "not friend", "pending", "friend"
}

const SearchPage = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [requesting, setRequesting] = useState<string>(""); // Store ID of the user for which the friend request is being sent

	const handleSearch = async (e: any) => {
		e.preventDefault();

		if (!query.trim()) return; // Prevent search if query is empty or whitespace

		setLoading(true);
		setError("");

		try {
			const res = await fetch(`/api/search?query=${query}`);
			if (!res.ok) {
				throw new Error("Failed to fetch results");
			}
			const data = await res.json();
			setResults(data);
		} catch (err) {
			console.error("Error fetching search results:", err);
			setError("Error fetching search results");
			setResults([]); // Clear results on error
		} finally {
			setLoading(false);
		}
	};

	const sendFriendRequest = async (userId: string) => {
		setRequesting(userId); // Set the requesting state to indicate loading for this user

		try {
			const res = await fetch(`/api/friends`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ friendId: userId }),
			});

			if (!res.ok) {
				throw new Error("Failed to send friend request");
			}

			// Update the friendStatus locally
			setResults((prev) =>
				prev.map((user) =>
					user._id === userId
						? { ...user, friendStatus: "pending" }
						: user
				)
			);
		} catch (err) {
			console.error("Error sending friend request:", err);
			alert("Error sending friend request");
		} finally {
			setRequesting(""); // Clear the requesting state
		}
	};

	return (
		<div className="container mx-auto p-4 text-black">
			<h1 className="text-3xl font-semibold mb-6">Search Users</h1>
			<form onSubmit={handleSearch} className="flex gap-2 mb-6">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search users..."
					className="flex-1 p-2 border bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					aria-label="Search"
				/>
				<button
					type="submit"
					className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
					disabled={loading} // Disable button while loading
				>
					{loading ? "Searching..." : "Search"}
				</button>
			</form>

			{error && <p className="text-red-500 mb-4">{error}</p>}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				{results.length > 0 ? (
					results.map((user) => (
						<div
							key={user._id}
							className="bg-white border p-4 rounded-lg shadow hover:shadow-lg transition"
						>
							{/* User Avatar */}
							<div className="flex items-center justify-center mb-4">
								<img
									src={
										user.photo ||
										"/images/default-avatar.png"
									}
									alt={`${user.username}'s avatar`}
									className="w-16 h-16 rounded-full object-cover"
								/>
							</div>

							{/* User Details */}
							<h2 className="text-lg font-semibold text-center">
								{user.firstname || "Unknown"}{" "}
								{user.lastname || ""}
							</h2>
							<p className="text-gray-500 text-center mb-4">
								{user.email}
							</p>

							{/* Friend Status / Actions */}
							<div className="text-center">
								{user.friendStatus === "friend" ? (
									<span className="text-green-500 font-semibold">
										Friend
									</span>
								) : user.friendStatus === "pending" ? (
									<span className="text-yellow-500 font-semibold">
										Request Sent
									</span>
								) : (
									<button
										className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
										disabled={requesting === user._id} // Disable if already requesting
										onClick={() =>
											sendFriendRequest(user._id)
										}
									>
										{requesting === user._id
											? "Sending..."
											: "Add Friend"}
									</button>
								)}
							</div>
						</div>
					))
				) : (
					<p className="text-gray-500">No users found</p>
				)}
			</div>
		</div>
	);
};

export default SearchPage;
