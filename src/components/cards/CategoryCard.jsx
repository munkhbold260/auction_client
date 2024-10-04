import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ITEMS } from "../../graphql/queries";
import ItemCard from "@/components/cards/ItemCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import client from "@/lib/apolloclient";

export default function CategoryCard({ category }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    // Кэш доторх бүх өгөгдлийг хэвлэх
    // console.log(client.cache.extract());
  }, []); // Өгөгдөл өөрчлөгдөх үед шалгах

  // Apollo Client ашиглан GET_ITEMS query-г дуудаж өгөгдөл авах
  const {
    data,
    loading: itemsLoading,
    error: itemsError,
  } = useQuery(GET_ITEMS);

  useEffect(() => {
    if (itemsError) {
      console.error("Items Error:", itemsError.message);
    } else if (data && data.getItems) {
      setItems(data.getItems);
    }
  }, [data, itemsError]);

  if (itemsError) return <p className="text-red-500">{itemsError.message}</p>;

  // Зөвхөн category.category_name-тай тохирох items-уудыг шүүх
  const filteredItems = items.filter(
    (item) => item.category === category.category_name
  );

  // `auction_start` цагийн дарааллаар эрэмбэлэх
  const sortedItems = filteredItems.sort(
    (a, b) => new Date(a.auction_start) - new Date(b.auction_start)
  );

  return (
    <div className="m-2 text-xl font-bold">
      <h3>{category.category_name}</h3>
      <div className="h-[210px] rounded-lg max-w-full overflow-x-auto whitespace-nowrap">
        {itemsLoading ? (
          Array(3)
            .fill()
            .map((_, index) => (
              <div key={index} className="inline-block mr-4">
                <Skeleton width={125} height={200} />
              </div>
            ))
        ) : sortedItems.length > 0 ? (
          sortedItems.map((item) => <ItemCard key={item.item_id} item={item} />)
        ) : (
          <p className="text-gray-500">No items available</p>
        )}
      </div>
    </div>
  );
}
