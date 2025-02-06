import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);



export async function POST(request: NextRequest) {
    try {
        const { amount } = await request.json();
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
        });
        // const paymentIntentData = await stripe.paymentIntents.retrieve(paymentIntent.id);
        // console.log(paymentIntentData,"IDSSS")
        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Internal Error:", error);
        return NextResponse.json(
            { error: `Internal Server Error: ${error}` },
            { status: 500 }
        );
    }
}

