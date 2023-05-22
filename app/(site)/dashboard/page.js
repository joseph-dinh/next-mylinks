import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import NavBar from "@/app/components/navbar/navBar";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (session) {
    return (
        <main className="">
            <NavBar session={session}/>
            <h1>Home</h1>
            <h1>Server Side Rendered</h1>
            <h1>{JSON.stringify(session)}</h1>
        </main>
      )
  }
}
