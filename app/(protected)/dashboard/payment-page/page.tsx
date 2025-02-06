import { handlePayment } from "../../../../actions/payment";
export default function PaymentSuccess({
    searchParams: { amount },
}: {
    searchParams: { amount: string };
}) {
    return (
        <form action={handlePayment} method="post" className="p-10">
        <h1 className="mb-4 text-2xl font-bold">Enter Payment Amount</h1>
        <input
          type="number"
          name="amount"
          placeholder="Enter amount"
          className="mb-4 w-full rounded-md border p-2"
          required
          min="1"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          Proceed to Payment
        </button>
      </form>
    );
}
