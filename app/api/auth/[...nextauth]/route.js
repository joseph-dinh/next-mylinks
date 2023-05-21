import NextAuth from "next-auth";
import prisma from '../../../libs/prismadb';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@email.com"},
        password: { label: "Password", type: "password", placeholder: "*********"},
        username: { label: "Username", type: "text", placeholder: "JohnDoe"}
      },
      async authorize(credentials) {

        // Check if user entered email and password
        if (!credentials.email || !credentials.password) {
          throw new Error("Please enter an email and password");
        };

        // Check if the email / user exists in database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        // If no user is found
        if (!user || !user?.hashedPassword) {
          // throw new Error("No user found");
          // For security purposes, leave generic error messages
          throw new Error("Incorrect email or password");
        };

        // Check to see if password matches
        const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

        // If Passwords do not match
        if (!passwordMatch) {
          // throw new Error("Incorrect password");
          // For security purposes, leave generic error messages
          throw new Error("Incorrect email or password")
        };

        return user;
      },
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }