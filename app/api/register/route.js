import bcrypt from "bcrypt";
import prisma from "../../libs/prismadb"
import { NextResponse } from "next/server";

export async function POST(request) {
    const body = request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
        return new NextResponse("Missing Fields", { status: 400 });
    };

    const existinguser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (existinguser) {
        throw new Error('Email already exists');
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })
}