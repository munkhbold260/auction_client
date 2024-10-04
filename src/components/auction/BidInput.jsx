// import { useState } from "react";

// function BidInput({ onSend }) {
//   const [bidAmount, setBidAmount] = useState(""); // Саналын утгыг state-д хадгална

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (bidAmount) {
//       onSend(bidAmount); // Санал илгээх функцийг дуудаж байна
//       setBidAmount(""); // Оруулсан саналыг дахин хоосолж байна
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex items-center space-x-3">
//       <input
//         type="number"
//         placeholder="Санал оруулна уу"
//         value={bidAmount}
//         onChange={(e) => setBidAmount(e.target.value)}
//         className="input flex-1 px-4 py-2 border rounded-lg focus:outline-none"
//       />
//       <button
//         type="submit"
//         className="btn bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//       >
//         Илгээх
//       </button>
//     </form>
//   );
// }

// export default BidInput;

import { useState, useEffect } from "react";

function BidInput({ onSend, basePrice, highestBid, winnerBid }) {
  const [bidAmount, setBidAmount] = useState(""); // Саналын утгыг state-д хадгална
  const [errorMessage, setErrorMessage] = useState(""); // Алдааны мессежийг хадгалах
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Товч идэвхгүй эсэхийг хянах

  // Саналын утгыг шалгах useEffect
  useEffect(() => {
    if (bidAmount) {
      const bidValue = parseFloat(bidAmount);
      if (highestBid) {
        if (bidValue <= highestBid) {
          setErrorMessage(`Өмнөх хэрэглэгчийн үнээс илүү үнэ оруулна уу`);
          setIsButtonDisabled(true);
        } else {
          setErrorMessage("");
          setIsButtonDisabled(false);
        }
      } else if (bidValue < basePrice) {
        setErrorMessage(`Үндсэн үнээс илүү үнэ оруулна уу`);
        setIsButtonDisabled(true);
      } else {
        setErrorMessage("");
        setIsButtonDisabled(false);
      }
    } else {
      setErrorMessage("");
      setIsButtonDisabled(true); // Санал хоосон үед товчийг идэвхгүй болгоно
    }
  }, [bidAmount, basePrice, highestBid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isButtonDisabled && bidAmount) {
      onSend(bidAmount); // Санал илгээх функцийг дуудаж байна
      setBidAmount(""); // Оруулсан саналыг дахин хоосолж байна
    }
  };
  if (winnerBid) {
    // winnerBid байгаа үед ямар ч input болон товч харуулахгүй
    return null;
  }
  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      <input
        type="number"
        placeholder="Санал оруулна уу"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        className="input flex-1 px-4 py-2 border rounded-lg focus:outline-none"
      />
      <div>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p> // Алдааны мессежийг харуулна
        )}
        <button
          type="submit"
          className={`btn text-white px-4 py-2 rounded-lg ${
            isButtonDisabled ? "bg-red-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isButtonDisabled} // Товчийг идэвхгүй болгож байна
        >
          Илгээх
        </button>
      </div>
    </form>
  );
}

export default BidInput;
