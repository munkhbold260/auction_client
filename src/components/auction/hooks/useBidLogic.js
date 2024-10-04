import { useState, useEffect } from "react";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { GET_BIDS } from "@/graphql/queries";
import { ADD_BID_SUBSCRIPTION } from "@/graphql/subscription";
import { ADD_BID_MUTATION } from "@/graphql/mutation";
import { useRouter } from "next/router";
import { toast } from "react-toastify"; // react-toastify-г импортлох
import "react-toastify/dist/ReactToastify.css"; // CSS файлыг импортлох

export const useBidLogic = (loggedUser) => {
  const router = useRouter();
  const { id } = router.query;
  const [countdown, setCountdown] = useState(15); // 15 секунд
  const [auctionStatus, setAuctionStatus] = useState("started"); // Auction статус
  const [lastBidTime, setLastBidTime] = useState(Date.now()); // Сүүлийн санал ирсэн хугацаа
  const [winner, setWinner] = useState(""); // Ялагчийн нэрийг хадгалах
  const [winnerBid, setWinnerBid] = useState("");

  // Сэрвэрээс тухайн барааны бүх саналуудыг авчирна.
  const { data } = useQuery(GET_BIDS, {
    variables: { item_id: id },
  });
  const bids = data?.get_bids_by_item_id ?? [];

  // 15 секундын countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const timePassed = Math.floor((Date.now() - lastBidTime) / 1000);
      const timeLeft = 20 - timePassed;

      if (timeLeft <= 0) {
        clearInterval(interval);
        setAuctionStatus("ended"); // Auction дуусах үед статусыг шинэчилнэ
        setCountdown(0);

        // Хамгийн сүүлд орж ирсэн саналыг ялагч болгон хадгалах
        if (bids.length > 0) {
          const lastBid = bids[bids.length - 1];
          setWinner(lastBid.bidded_user_name); // Ялагчийн нэрийг оруулах
          setWinnerBid(lastBid.bid);
        }
      } else {
        setCountdown(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastBidTime, bids]);

  // WebSocket ашиглан шинэ санал хүлээн авах
  useSubscription(ADD_BID_SUBSCRIPTION, {
    variables: { item_id: id },
    onData: ({ client, data }) => {
      const newBid = data?.data?.OnBidAdded;

      if (newBid) {
        client.cache.updateQuery(
          { query: GET_BIDS, variables: { item_id: id } },
          (oldCache) => ({
            get_bids_by_item_id: [
              ...(oldCache?.get_bids_by_item_id || []),
              newBid,
            ],
          })
        );
        toast.success("Шинэ санал ирлээ!"); // Toast-ийг харуулах
        setLastBidTime(Date.now()); // Шинэ санал ирэх үед 15 секундын тооллогыг дахин эхлүүлнэ
        setAuctionStatus("started");
      }
    },
    onError: (error) => {
      console.error("WS холболтын алдаа:", error);
    },
  });

  // Сэрвэр рүү шинэ санал илгээх функцийг гаргаж авах
  const [mutate] = useMutation(ADD_BID_MUTATION);

  // Санал нэмэх функц
  const addBid = async (bidAmount) => {
    const { data } = await mutate({
      variables: {
        item_id: id,
        bid_id: `bid_${Date.now()}`,
        bidded_user_id: loggedUser.userid,
        bid: bidAmount,
        created_at: new Date().toISOString(),
        bidded_user_name: loggedUser.name,
        bidded_user_email: loggedUser.email,
        bid_won_user_email: "",
        bid_win: "",
      },
    });
    return data;
  };

  return { bids, addBid, countdown, auctionStatus, winner, winnerBid }; // Ялагчийн нэрийг буцаана
};
