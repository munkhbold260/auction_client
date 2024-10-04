import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ArrowForward } from "@mui/icons-material";

export default function ItemOpen({ item }) {
  const router = useRouter();

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [auctionStatus, setAuctionStatus] = useState(""); // Auction статусыг харуулах
  const [num, setNum] = useState(0); // Зургийн индексийг хадгалах төлөв

  // Зургийн индексийг нэмэгдүүлэх функц
  const increase = () => {
    setNum((prev) => (prev === item.images_url.length - 1 ? 0 : prev + 1));
  };
  const decrease = () => {
    setNum((prev) => {
      prev === item.images_url.length - 1 ? 0 : prev - 1;
    });
  };
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date().getTime();
      const auctionStart = parseInt(item.auction_start); // Auction эхлэх timestamp
      const auctionEnd = parseInt(item.auction_end); // Auction дуусах timestamp

      let timeDiff;
      if (now < auctionStart) {
        // Auction эхлээгүй байна
        timeDiff = auctionStart - now;
        setAuctionStatus("coming");
      } else if (now >= auctionStart && now < auctionEnd) {
        // Auction эхэлсэн, дуусаагүй байна
        timeDiff = auctionEnd - now;
        setAuctionStatus("started");
      } else {
        // Auction дууссан
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setAuctionStatus("ended");
        return;
      }

      // Countdown тооцоолол
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    // 1 секунд тутамд шинэчлэгдэнэ
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval); // Төлөвийг цэвэрлэх
  }, [item.auction_start, item.auction_end]);
  const handleClick = (e) => {
    const token = localStorage.getItem("token");

    // Хэрэв токен байхгүй бол login хуудас руу шилжүүлнэ
    if (!token) {
      e.preventDefault();
      router.push("/log-in");
    } else {
      try {
        // Токены хугацааг шалгах
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        if (Date.now() >= exp * 1000) {
          e.preventDefault();
          localStorage.removeItem("token");
          router.push("/log-in");
        } else {
          // Хэрэв токен хүчинтэй бол item_type шалгаж, зохих хуудас руу шилжүүлнэ
          if (item.item_type === "open") {
            router.push(`/auction_open/${item.item_id}`);
          }
        }
      } catch (err) {
        console.error("Token parsing error:", err);
        e.preventDefault();
        router.push("/log-in");
      }
    }
  };

  return (
    <div className="p-4 w-full max-w-4xl h-full flex flex-col items-center bg-gray-100 shadow-xl rounded-lg">
      <div className="flex justify-between items-center w-full mb-6">
        <div className="text-left">
          <ArrowBackIcon
            onClick={() => router.back()}
            className="text-gray-600"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">{item.name}</h1>
      </div>
      <div className="h-[256px]">
        <Image
          src={item.images_url[num]}
          alt={item.name}
          width={500}
          height={500}
          className="object-cover rounded-lg shadow-md mb-6"
          onClick={increase}
        />
      </div>
      <div className="text-left w-full">
        <p className="text-lg font-medium text-gray-700 mb-4">
          {item.description}
        </p>
        <p className="text-xl font-semibold text-gray-800">
          Auction Type: <span className="text-blue-600">{item.item_type}</span>
        </p>
        <p className="text-xl font-bold text-green-600 mb-4">
          Price: {item.price}$
        </p>
      </div>

      {/* Auction Status ба Countdown */}
      {auctionStatus === "coming" ? (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-gray-700">
            Auction Starts In:
          </p>
          <p className="text-3xl font-bold text-gray-800">
            {countdown.days}d {countdown.hours}h {countdown.minutes}m{" "}
            {countdown.seconds}s
          </p>
        </div>
      ) : auctionStatus === "started" ? (
        <div className="mt-6 text-center">
          <button
            onClick={handleClick}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
          >
            <p>Дуудлага худалдаанд оролцох.</p>
          </button>
          <p className="text-lg font-semibold text-gray-700 mt-4">
            Auction Ends In:
          </p>
          <p className="text-3xl font-bold text-gray-800">
            {countdown.days}d {countdown.hours}h {countdown.minutes}m{" "}
            {countdown.seconds}s
          </p>
        </div>
      ) : auctionStatus === "ended" ? (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-red-600">Auction Ended</p>
        </div>
      ) : null}
    </div>
  );
}
