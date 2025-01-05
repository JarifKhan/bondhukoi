"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface User {
	_id: string;
	clerkId: string;
	email: string;
	username: string;
	firstname: string;
	lastname: string;
	photo: string | null;
}

interface FriendRequest {
	_id: string;
	user: User;
	status: string;
}

interface Friend {
	_id: string;
	user: User;
	friend: User;
}

export default function Friend() {
	const [requests, setRequests] = useState<FriendRequest[]>([]);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [loadingRequests, setLoadingRequests] = useState(true);
	const [loadingFriends, setLoadingFriends] = useState(true);
	const [error, setError] = useState("");
	const [accepting, setAccepting] = useState<string>(""); // To track which request is being accepted
	const [unfriending, setUnfriending] = useState<string>(""); // To track which friend is being unfriended
	const { user, isLoaded } = useUser();

	// Fetch pending friend requests
	const fetchRequests = async () => {
		setLoadingRequests(true);
		setError("");

		try {
			const res = await fetch("/api/friends");
			if (!res.ok) {
				throw new Error("Failed to fetch friend requests");
			}

			const data = await res.json();
			setRequests(data);
		} catch (err) {
			console.error("Error fetching friend requests:", err);
			setError("Error fetching friend requests");
		} finally {
			setLoadingRequests(false);
		}
	};

	// Fetch all friends
	const fetchFriends = async () => {
		setLoadingFriends(true);
		setError("");

		try {
			const res = await fetch("/api/get-all-friends");
			if (!res.ok) {
				throw new Error("Failed to fetch friends");
			}

			const data = await res.json();
			setFriends(data);
		} catch (err) {
			console.error("Error fetching friends:", err);
			setError("Error fetching friends");
		} finally {
			setLoadingFriends(false);
		}
	};

	// Accept a friend request
	const acceptRequest = async (requestId: string) => {
		setAccepting(requestId); // Indicate loading state for this request

		try {
			const res = await fetch("/api/friends", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ requestId }),
			});

			if (!res.ok) {
				throw new Error("Failed to accept friend request");
			}

			// Remove the accepted request from the list
			setRequests((prev) => prev.filter((req) => req._id !== requestId));

			// Refresh the friends list
			fetchFriends();
		} catch (err) {
			console.error("Error accepting friend request:", err);
			alert("Error accepting friend request");
		} finally {
			setAccepting(""); // Clear loading state
		}
	};

	// Unfriend a friend
	const unfriend = async (friendId: string, dbId: string) => {
		setUnfriending(friendId); // Indicate loading state for this friend

		try {
			const res = await fetch("/api/friends", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ friendId: dbId }),
			});

			if (!res.ok) {
				throw new Error("Failed to unfriend");
			}

			// Remove the unfriended person from the friends list
			setFriends((prev) =>
				prev.filter(
					(friend) =>
						friend.user._id !== friendId &&
						friend.friend._id !== friendId
				)
			);
		} catch (err) {
			console.error("Error unfriending:", err);
			alert("Error unfriending");
		} finally {
			setUnfriending(""); // Clear loading state
		}
	};

	// Fetch data on component mount
	useEffect(() => {
		fetchRequests();
		fetchFriends();
	}, []);

	if (!isLoaded)
		return (
			<div className="container mx-auto text-black p-4">
				<p className="text-gray-500">Loading...</p>
			</div>
		);

	return (
		<div className="container mx-auto text-black p-4">
			{error && <p className="text-red-500 mb-4">{error}</p>}

			{/* Pending Friend Requests */}
			<h2 className="text-2xl text-white font-semibold mb-4">
				Pending Friend Requests
			</h2>
			{loadingRequests ? (
				<p className="text-gray-500">Loading requests...</p>
			) : requests.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
					{requests.map((request) => (
						<div
							key={request._id}
							className="bg-white border p-4 rounded-lg shadow hover:shadow-lg transition"
						>
							{/* User Avatar */}
							<div className="flex items-center justify-center mb-4">
								<img
									src={
										request.user.photo ||
										"/images/default-avatar.png"
									}
									alt={`${request.user.username}'s avatar`}
									className="w-16 h-16 rounded-full object-cover"
								/>
							</div>

							{/* User Details */}
							<h2 className="text-lg font-semibold text-center">
								{request.user.firstname || "Unknown"}{" "}
								{request.user.lastname || ""}
							</h2>
							<p className="text-gray-500 text-center mb-4">
								{request.user.email}
							</p>

							{/* Accept Button */}
							<div className="text-center">
								<button
									className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
									disabled={accepting === request._id} // Disable if accepting this request
									onClick={() => acceptRequest(request._id)}
								>
									{accepting === request._id
										? "Accepting..."
										: "Accept"}
								</button>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-gray-500">No pending friend requests</p>
			)}

			{/* Accepted Friends */}
			<h2 className="text-2xl text-white font-semibold mb-4">
				My Friends
			</h2>
			{loadingFriends ? (
				<p className="text-gray-500">Loading friends...</p>
			) : friends.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{friends.map((friend) => {
						// Determine which user is the friend (either "user" or "friend")
						const myId = user?.id;
						const friendUser =
							friend.user.clerkId === myId
								? friend.friend
								: friend.user;

						return (
							<div
								key={friend._id}
								className="bg-white border p-4 rounded-lg shadow hover:shadow-lg transition"
							>
								{/* User Avatar */}
								<div className="flex items-center justify-center mb-4">
									<img
										src={
											friendUser.photo ||
											"/images/default-avatar.png"
										}
										alt={`${friendUser.username}'s avatar`}
										className="w-16 h-16 rounded-full object-cover"
									/>
								</div>

								{/* User Details */}
								<h2 className="text-lg font-semibold text-center">
									{friendUser.firstname} {friendUser.lastname}
								</h2>
								<p className="text-gray-500 text-center">
									{friendUser.email}
								</p>

								{/* Unfriend Button */}
								<div className="text-center mt-4">
									<button
										className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
										disabled={
											unfriending === friendUser._id
										} // Disable if unfriending this friend
										onClick={() =>
											unfriend(friendUser._id, friend._id)
										}
									>
										{unfriending === friendUser._id
											? "Unfriending..."
											: "Unfriend"}
									</button>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<p className="text-gray-500">No friends found</p>
			)}
		</div>
	);
}
