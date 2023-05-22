import bcrypt from "bcrypt";
import prisma from "../../libs/prismadb";
import { NextResponse } from "next/server";

const symbolRegex = /[$-/:-?{-~!"^_`\[\]]/;
const numberRegex = /\d/;
const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    const existinguser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existinguser) {
      return new NextResponse("Email already exists", { status: 409 });
    }

    if (password.length < 8) {
      return new NextResponse("Password must be at least 8 characters long", { status: 400 });
    }

    if (!uppercaseRegex.test(password)) {
        return new NextResponse("Password must contain at least 1 uppercase letter", { status: 400 });
    }

    if (!lowercaseRegex.test(password)) {
        return new NextResponse("Password must contain at least 1 lowercase letter", { status: 400 });
    }

    if (!symbolRegex.test(password)) {
        return new NextResponse("Password must contain at least 1 symbol", { status: 400 });
    }

    if (!numberRegex.test(password)) {
        return new NextResponse("Password must contain at least 1 number", { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
