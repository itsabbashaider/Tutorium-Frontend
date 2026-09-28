export async function updateUserRole(role) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const response = await fetch(`${apiUrl}/onboarding/role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
    credentials: "include", // Required to send and receive HTTP-only cookies
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to assign role.");
  }

  return data;
}