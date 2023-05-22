import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  console.log(session)
  if (session) {
    return (
        <main className="">
          <h1>Home</h1>
          <h1>Server Side Rendered</h1>
          <h1>{JSON.stringify(session)}</h1>
        </main>
      )
  }
}
