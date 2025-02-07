import React from "react";

import { XCircleIcon } from "@heroicons/react/outline"; // Ensure you have @heroicons/react installed

const PaymentFail = () => {

  return (
    <main className="h-full  flex items-center justify-center ">
      <div className="w-11/12 max-w-2xl mx-auto p-8 text-center bg-white shadow-xl rounded-lg">
        <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold text-red-600 mb-2">Payment Failed</h1>
        <p className="text-lg text-gray-700 mb-6">
          Oops! Your payment could not be processed. Please try again or contact support.
        </p>
      </div>
    </main>
  );
};

export default PaymentFail;
