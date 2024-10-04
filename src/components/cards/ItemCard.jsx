import Image from "next/image";
import { useRouter } from "next/router";

export default function ItemCard({ item }) {
  const router = useRouter();

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
            router.push(`/item-open/${item.item_id}`);
          } else if (item.item_type === "closed") {
            router.push(`/item-closed/${item.item_id}`);
          }
        }
      } catch (err) {
        console.error("Token parsing error:", err);
        e.preventDefault();
        router.push("/log-in");
      }
    }
  };

  const auctionStart = new Date(parseInt(item.auction_start));
  const auctionEnd = new Date(parseInt(item.auction_end));

  return (
    <div
      className="inline-block w-[125px] h-[200px] bg-gray-600 text-white items-center justify-center mr-4 rounded-lg overflow-hidden cursor-pointer"
      onClick={handleClick} // Item дээр дарахад шалгах функц
    >
      <Image
        src={item.images_url[0]} // Эхний зургийн URL
        alt={item.name} // Зургийн alt текст
        width={125} // Тодорхой хэмжээ
        height={85} // Тодорхой хэмжээ
        className="object-cover" // Зургийн засварлах арга
      />
      <div className="ml-1">
        <p className="text-[16px] font-light text-center mt-2">{item.name}</p>
        <p className="text-[16px]">{item.price}$</p>
        <p className="text-[16px] font-light">
          Эхлэх: {auctionStart.toLocaleString()} {/* Эхлэх огноо */}
        </p>
        <p className="text-[16px] font-light">
          Дуусах: {auctionEnd.toLocaleString()} {/* Дуусах огноо */}
        </p>
      </div>
    </div>
  );
}
