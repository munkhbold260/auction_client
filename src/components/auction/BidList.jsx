import { useEffect, useRef } from "react";
import BidRow from "./BidRow";

// Саналуудыг харуулах компонент
function BidList({ loggedUser, bids }) {
  const containerRef = useRef();

  // Шинэ санал ирэх үед автоматаар доош нь зөөлөн гүйлгэх
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth", // Зөөлөн гүйлт хийх
      });
    }
  }, [bids]);

  return (
    <div
      ref={containerRef}
      className="box max-h-[50vh] overflow-y-auto p-4 bg-gray-100 rounded-lg shadow-md"
    >
      {bids.map((bid) => (
        <BidRow key={bid.bid_id} loggedUser={loggedUser} bid={bid} />
      ))}
    </div>
  );
}

export default BidList;
