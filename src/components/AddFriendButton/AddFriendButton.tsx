import { useUser } from '@clerk/nextjs';

const AddFriendButton = ({ friendId }) => {
  const { user } = useUser();

  const addFriend = async () => {
    try {
      const response = await fetch('/api/friends/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert('Friend added successfully');
    } catch (error) {
      alert(error!.message);
    }
  };

  return <button onClick={addFriend}>Add Friend</button>;
};

export default AddFriendButton;
