import { useBidLogic } from "./hooks/useBidLogic";
import BidList from "./BidList";
import BidInput from "./BidInput";
import Header from "../header/Header";
import { ToastContainer } from "react-toastify"; // ToastContainer-ийг импортлох
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ITEM_BY_ID } from "@/graphql/queries";

function BidChat({ loggedUser }) {
  const { bids, addBid, countdown, auctionStatus, winner, winnerBid } =
    useBidLogic(loggedUser); // Ялагчийн нэрийг нэмсэн
  const highestBid =
    bids.length > 0 ? Math.max(...bids.map((bid) => bid.bid)) : null;

  // const { loading, error, data } = useQuery(GET_ITEM_BY_ID, {
  //   variables: { item_id: bids[0].item_id },
  //   fetchPolicy: "cache-first",
  // });

  useEffect(() => {
    if (auctionStatus === "ended") {
      window.scrollTo({
        top: document.body.scrollHeight, // Дэлгэцийн доод хэсэг рүү гүйлгэх
        behavior: "smooth", // Зөөлөн гүйлгэх
      });
    }
  }, [auctionStatus]); // auctionStatus дууссан үед гүйлгээ хийнэ

  // Санал илгээх үед ажиллах функц
  const handleSend = async (bidAmount) => {
    const data = await addBid(bidAmount);
    console.log("Илгээсэн санал: ", data);
  };

  return (
    <section className="section">
      <div className="container sm:px-6 lg:px-8">
        <Header />
        {/* ToastContainer-ийг байрлуулах */}
        <ToastContainer position="top-right" autoClose={1500} />
        <p className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 px-4 rounded-md shadow-md w-full">
          <strong className="font-bold">Анхааруулга:</strong>
          <span className="block text-sm sm:inline">
            Дуудлага худалдаа явагдаж байх үед таны холболтын хугацаа дуусч
            холболт тасрах тул та холболтыг шинэчилээрэй.
          </span>
        </p>

        <div className="bids-list  max-h-[500px] sm:max-h-[400px] overflow-y-auto">
          <BidList loggedUser={loggedUser} bids={bids} />
        </div>

        {/* Countdown болон ялагчийн хэсэг */}
        {bids.length > 0 && (
          <div className="text-center py-4 transition-all duration-500 ease-in-out min-h-[150px]">
            {auctionStatus === "started" ? (
              <>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
                  Дуудлага худалдааны хугацаа
                </h2>
                <p className="text-lg font-semibold text-gray-800">
                  {countdown} секунд үлдлээ
                </p>
              </>
            ) : (
              <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                  🎉 Дуудлага худалдаа дууслаа!
                </h2>
                <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                  <p className="text-lg font-semibold text-white">
                    🏆 Ялагч: <span className="text-yellow-400">{winner}</span>
                  </p>
                  <p className="text-lg font-semibold text-white">
                    💰 Дээд үнэ:{" "}
                    <span className="text-green-400">${winnerBid}</span>
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  Баяр хүргэе, та дуудлага худалдааны ялагч боллоо!
                </p>
              </div>
            )}
          </div>
        )}

        {!winnerBid && (
          <div className="fixed bottom-0 left-0 w-full p-4 bg-white shadow-lg border-t">
            <BidInput
              onSend={handleSend}
              basePrice={1000}
              highestBid={highestBid}
              winnerBid={winnerBid}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default BidChat;
