import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

interface UpdateBookingRequest {
  bookingId: string;
  status: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'khandelwalkh09@gmail.com',
    pass: 'jdoh hzez jnln djrk',
  },
});

export async function PUT(request: NextRequest): Promise<NextResponse> {
  console.log("Received PUT request at:", new Date().toISOString());

  try {
    const body: UpdateBookingRequest = await request.json();
    console.log("Request Body:", body);

    if (!body.bookingId || !body.status) {
      return NextResponse.json(
        { success: false, message: "Missing bookingId or status" },
        { status: 400 }
      );
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: body.bookingId },
    });

    if (existingBooking?.bookingStatus === body.status) {
      console.log("Booking already updated, skipping email.");
      return NextResponse.json(
        { success: true, message: "Booking status already updated." },
        { status: 200 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: body.bookingId },
      data: { bookingStatus: body.status },
      include: { user: true, origin: true, destination: true, fare: true },
    });

    const userEmail = updatedBooking.user?.email;
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "User email not found" },
        { status: 404 }
      );
    }

    // Updated HTML email template
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
            body, p, h1, h2, h3, table, td {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                line-height: 1.5;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
            }
            .header {
                background-color: black;
                color: white;
                padding: 24px;
                text-align: center;
                font-size: 24px;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 24px;
                background-color: #f8f9fa;
            }
            .booking-details {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e0e0e0;
            }
            .details-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            .details-table td {
                padding: 10px;
                border-bottom: 1px solid #e0e0e0;
            }
            .label {
                color: #666;
                font-size: 14px;
            }
            .value {
                font-weight: bold;
                font-size: 16px;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #1a73e8;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 16px;
                text-align: center;
            }
            .footer {
                text-align: center;
                margin-top: 24px;
                color: #666;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                Booking Confirmation
            </div>
            <div class="content">
                <p>Dear <strong>${updatedBooking.user.name}</strong>,</p>
                <p>Your booking has been successfully confirmed! Here are your trip details:</p>
                
                <div class="booking-details">
                    <table class="details-table">
                          <tr>
                              <td class="label">From:</td>
                              <td class="value">${updatedBooking.origin.name}</td>
                          </tr>
                        <tr>
                            <td class="label">To:</td>
                            <td class="value">${updatedBooking.destination.name}</td>
                        </tr>
                        <tr>
                            <td class="label">Price:</td>
                            <td class="value">$${updatedBooking.fare.price}</td>
                        </tr>
                        <tr>
                            <td class="label">Seat Number:</td>
                            <td class="value">${updatedBooking.seatNumber}</td>
                        </tr>
                    </table>
                </div>
    
                <p>If you have any questions, feel free to contact our customer support team.</p>
                <p>Thank you for choosing ABC Transport Service!</p>
    
                <p>Best regards,<br><strong>Your Transport Team</strong></p>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>© 2024 ABC Transport Service. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const mailOptions = {
      from: `"ABC Transport Service" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: "Your Booking Confirmation",
      html: htmlContent,
      text: `Dear ${updatedBooking.user.name},
    
    Your booking with ID ${updatedBooking.id} has been confirmed.
    
    Trip Details:
    - From: ${updatedBooking.origin.name}
    - To: ${updatedBooking.destination.name}
    - Fare: $${updatedBooking.fare.price}
    - Seat Number: ${updatedBooking.seatNumber}
    
    If you have any questions, please contact our support team.
    
    Thank you for choosing ABC Transport Service.
    
    Best regards,
    Your Transport Team`,
    };
    
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    return NextResponse.json(
      { success: true, booking: updatedBooking },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}