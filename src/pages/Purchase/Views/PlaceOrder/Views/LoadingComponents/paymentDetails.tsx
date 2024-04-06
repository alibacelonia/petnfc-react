const PaymentDetailsLoadingComponent = () => {
  return (
    <>
      {/* Loading Element of Payment Details */}
      {/* <div className="w-full md:w-7/12 bg-white rounded-md shadow-md px-6 py-5 lg:px-12 lg:py-10"> */}
        {/* <h1 className="text-lg sm:text-base md:text-lg lg:text-xl font-bold text-gray-700">
          Payment Details
        </h1>
        <p className="text-sm text-gray-500">
          Enter your payment detais below to purchase.
        </p> */}

        {/* Email Placeholder */}
        <div className="animate-pulse flex space-x-4 mt-12">
          <div className="flex-1 space-y-3 py-1">
            {/* Label */}
            <div className="h-2 bg-slate-200 rounded w-20"></div>
            {/* Text Input */}
            <div className="h-10 bg-slate-200 rounded"></div>
          </div>
        </div>

        {/* Card Number Placeholder */}
        <div className="animate-pulse flex space-x-4 mt-5">
          <div className="flex-1 space-y-3 py-1">
            {/* Label */}
            <div className="h-2 bg-slate-200 rounded w-20"></div>
            {/* Text Input */}
            <div className="h-10 bg-slate-200 rounded"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-slate-200 rounded w-14"></div>
              <div className="h-8 bg-slate-200 rounded w-14"></div>
            </div>
          </div>
        </div>

        {/* Card Number Placeholder */}
        <div className="animate-pulse flex space-x-4 mt-6">
          <div className="flex-1 space-y-6 py-1">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="">
                  {/* Label */}
                  <div className="h-2 bg-slate-200 rounded w-20 mt-1"></div>
                  {/* Text Input */}
                  <div className="h-10 bg-slate-200 rounded mt-3"></div>
                </div>
                <div className="">
                  {/* Label */}
                  <div className="flex gap-1 items-center justify-start">
                    <div className="h-2 bg-slate-200 rounded w-16"></div>
                    <div className="rounded-full bg-slate-200 h-3 w-3"></div>
                  </div>
                  {/* Text Input */}
                  <div className="h-10 bg-slate-200 rounded mt-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Address Placeholder */}
        <div className="animate-pulse flex space-x-4 mt-6">
          <div className="flex-1 space-y-3 py-1">
            {/* Label */}
            <div className="h-2 bg-slate-200 rounded w-20"></div>
            {/* Text Input */}
            <div className="h-10 bg-slate-200 rounded"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
          </div>
        </div>

        {/* Card Number Placeholder */}
        <div className="animate-pulse flex space-x-4 mt-6">
          <div className="flex-1 space-y-6 py-1">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="">
                  {/* Label */}
                  <div className="h-2 bg-slate-200 rounded w-20"></div>
                  {/* Text Input */}
                  <div className="h-10 bg-slate-200 rounded mt-3"></div>
                </div>
                <div className="">
                  {/* Label */}
                  <div className="flex gap-1 items-center justify-start">
                    <div className="h-2 bg-slate-200 rounded w-20"></div>
                  </div>
                  {/* Text Input */}
                  <div className="h-10 bg-slate-200 rounded mt-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* End of loading container */}
      {/* </div> */}
    </>
  );
};

export default PaymentDetailsLoadingComponent;
