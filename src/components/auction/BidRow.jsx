function BidRow({ loggedUser, bid }) {
  const isUserBid = bid.bidded_user_id === loggedUser.userid;

  return (
    <div
      className={`flex items-center justify-between mb-4 px-4 py-2 rounded-lg shadow-md w-full ${
        isUserBid
          ? "bg-blue-100 border-l-4 border-blue-500"
          : "bg-white border-l-4 border-gray-300"
      }`}
    >
      <div className="flex items-center space-x-4">
        <span
          className={`font-semibold ${
            isUserBid ? "text-blue-600" : "text-gray-800"
          }`}
        >
          {isUserBid ? "Таны санал" : bid.bidded_user_name}
        </span>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-800">{`Санал: $${bid.bid}`}</p>
        <p className="text-sm text-gray-500">{`Цаг: ${new Date(
          bid.created_at
        ).toLocaleTimeString()}`}</p>
      </div>
    </div>
  );
}

export default BidRow;
