const RemoveFriendButton = ({ friendId }) => {
    const removeFriend = async () => {
      try {
        const response = await fetch('/api/friends/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ friendId }),
        });
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
  
        alert('Friend removed successfully');
      } catch (error) {
        alert(error.message);
      }
    };
  
    return <button onClick={removeFriend}>Remove Friend</button>;
  };
  
  export default RemoveFriendButton;
  