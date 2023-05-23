// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import prisma from "../../libs/prismadb";

// export async function getServerSideProps(context) {
//     const session = getServerSession(authOptions);
//     const { displayName } = context.displayName;

//     const user = await prisma.user.findUnique({
//         where: {
//           email: displayName,
//         }
//       });

    
// }