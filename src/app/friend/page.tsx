'use client'

import { useAuth } from '@clerk/nextjs';

export default function GetToken() {
  const { getToken } = useAuth();

  const fetchToken = async () => {
    const token = await getToken();
    console.log('Token:', token);
  };

  return <button onClick={fetchToken}>Get Token</button>;
}
