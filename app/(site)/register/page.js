import UserRegistration from "@/app/components/register/userRegistration"

export default async function Home() {
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
        <UserRegistration/>
    </main>
  )
}
