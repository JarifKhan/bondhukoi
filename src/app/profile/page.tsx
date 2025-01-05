"use client";

import { useEffect, useState } from "react";

interface UserProfile {
	clerkId: string;
	email: string;
	username: string;
	firstname: string;
	lastname: string;
	photo?: string;
}

interface Routine {
	_id: string;
	day: string;
	startTime: string;
	endTime: string;
}

interface Schedule {
	_id: string;
	user: string;
	routine: Routine[];
	public: boolean;
}

export default function Page() {
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [schedule, setSchedule] = useState<Schedule | null>(null);
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({ day: "", startTime: "", endTime: "" });
	const [error, setError] = useState("");

	// Fetch profile and schedule
	const fetchData = async () => {
		setLoading(true);
		try {
			// Fetch profile
			const profileRes = await fetch("/api/profile");
			if (!profileRes.ok) throw new Error("Failed to fetch profile");
			const profileData = await profileRes.json();
			setProfile(profileData);

			// Fetch schedule
			const scheduleRes = await fetch("/api/schedule");
			if (!scheduleRes.ok) throw new Error("Failed to fetch schedule");
			const scheduleData = await scheduleRes.json();
			setSchedule(scheduleData);
		} catch (err) {
			console.error(err);
			setError("Error loading data");
		} finally {
			setLoading(false);
		}
	};

	// Toggle public/private mode
	const togglePublic = async () => {
		try {
			const res = await fetch("/api/schedule", { method: "PUT" });
			if (!res.ok) throw new Error("Failed to toggle schedule privacy");
			const updatedSchedule = await res.json();
			setSchedule(updatedSchedule.schedule);
		} catch (err) {
			console.error(err);
			alert("Error toggling schedule privacy");
		}
	};

	// Add new routine
	const addRoutine = async () => {
		if (!form.day || !form.startTime || !form.endTime) {
			alert("Please fill in all fields");
			return;
		}

		try {
			const res = await fetch("/api/schedule", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			if (!res.ok) throw new Error("Failed to add routine");
			const updatedSchedule = await res.json();
			setSchedule(updatedSchedule.schedule);
			setForm({ day: "", startTime: "", endTime: "" }); // Clear the form
		} catch (err) {
			console.error(err);
			alert("Error adding routine");
		}
	};

	// Delete routine
	const deleteRoutine = async (routineId: string) => {
		try {
			const res = await fetch("/api/schedule", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ routineId }),
			});
			if (!res.ok) throw new Error("Failed to delete routine");
			const updatedSchedule = await res.json();
			setSchedule(updatedSchedule.schedule);
		} catch (err) {
			console.error(err);
			alert("Error deleting routine");
		}
	};

	// Fetch data on mount
	useEffect(() => {
		fetchData();
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div className="container text-black mx-auto px-4 py-8">
			{/* Profile Section */}
			<h1 className="text-3xl font-semibold mb-6">Profile</h1>
			{profile && (
				<div className="bg-white shadow rounded-lg p-6 mb-8">
					<div className="flex items-center gap-4">
						<img
							src={profile.photo || "/images/default-avatar.png"}
							alt="Profile"
							className="w-16 h-16 rounded-full object-cover"
						/>
						<div>
							<h2 className="text-xl font-bold">
								{profile.firstname} {profile.lastname}
							</h2>
							<p className="text-gray-500">@{profile.username}</p>
							<p className="text-gray-500">{profile.email}</p>
						</div>
					</div>
				</div>
			)}

			{/* Schedule Section */}
			<h2 className="text-2xl font-semibold mb-4">Schedule</h2>
			{schedule && (
				<div className="bg-white shadow rounded-lg p-6">
					{/* Toggle Public/Private */}
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-xl font-semibold">Routines</h3>
						<button
							className={`px-4 py-2 rounded-lg ${
								schedule.public
									? "bg-green-500 text-white"
									: "bg-gray-500 text-white"
							}`}
							onClick={togglePublic}
						>
							{schedule.public
								? "Set to Private"
								: "Set to Public"}
						</button>
					</div>

					{/* Routines List */}
					<div className="space-y-4">
						{schedule.routine.map((routine) => (
							<div
								key={routine._id}
								className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
							>
								<div>
									<p className="font-semibold">
										{routine.day}
									</p>
									<p className="text-gray-500">
										{routine.startTime} - {routine.endTime}
									</p>
								</div>
								<button
									className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
									onClick={() => deleteRoutine(routine._id)}
								>
									Delete
								</button>
							</div>
						))}
					</div>

					{/* Add Routine Form */}
					<div className="mt-6">
						<h4 className="text-lg font-semibold mb-2">
							Add Routine
						</h4>
						<div className="flex items-center gap-4">
							<select
								title="Select Day"
								value={form.day}
								onChange={(e) =>
									setForm({ ...form, day: e.target.value })
								}
								className="p-2 border rounded-lg w-1/3"
							>
								<option value="">Select Day</option>
								{[
									"Monday",
									"Tuesday",
									"Wednesday",
									"Thursday",
									"Friday",
									"Saturday",
									"Sunday",
								].map((day) => (
									<option key={day} value={day}>
										{day}
									</option>
								))}
							</select>
							<input
								type="time"
								value={form.startTime}
								onChange={(e) =>
									setForm({
										...form,
										startTime: e.target.value,
									})
								}
								className="p-2 border rounded-lg w-1/3"
								placeholder="Start Time"
							/>
							<input
								type="time"
								value={form.endTime}
								onChange={(e) =>
									setForm({
										...form,
										endTime: e.target.value,
									})
								}
								className="p-2 border rounded-lg w-1/3"
								placeholder="End Time"
							/>
							<button
								className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
								onClick={addRoutine}
							>
								Add
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
