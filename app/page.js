import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"

export default async function Home() {
  const session = await getServerSession(authOptions)
  return (
    <main className="">
      <h1>Home</h1>
      <h1>Server Side Rendered</h1>
      <h1>{JSON.stringify(session)}</h1>
    </main>
  )
}
