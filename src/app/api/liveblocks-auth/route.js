import { Liveblocks } from "@liveblocks/node";
import { Client, Account } from "appwrite";

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY,
});

export async function POST(request) {
  try {
    // 1. Get JWT from the body (Liveblocks sends body payload)
    const { token } = await request.json();

    if (!token) {
      return new Response("Missing Authorization Token", { status: 401 });
    }

    // 2. Set the JWT on the Appwrite client
    client.setJWT(token);

    // 3. Verify User with Appwrite
    const account = new Account(client);
    const user = await account.get();

    if (!user) {
      return new Response("Invalid Token", { status: 401 });
    }

    // 4. Start Liveblocks Session
    const session = liveblocks.prepareSession(user.$id, {
      userInfo: {
        name: user.name,
        email: user.email,
        color: "#10b981",
      },
    });

    // 5. Allow access
    // Note: The 'room' is technically available in the request body if needed for checking permissions
    // const { room } = await request.json();
    session.allow("*", session.FULL_ACCESS); // Allow access to the specific room

    const { status, body } = await session.authorize();
    return new Response(body, { status });
  } catch (error) {
    console.error("Auth Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
