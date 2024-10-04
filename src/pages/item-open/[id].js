import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GET_ITEM_BY_ID } from "@/graphql/queries";
import Skeleton from "react-loading-skeleton";
import Header from "@/components/header/Header";
import ItemOpen from "@/components/ItemOpen";

export default function ItemDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_ITEM_BY_ID, {
    variables: { item_id: id },
    fetchPolicy: "cache-first",
  });

  // Өгөгдөл ачаалж байхад Skeleton-ийг харуулах
  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-4">
        <Skeleton width="80%" height={30} className="mb-4" />
        <Skeleton width="90%" height={20} className="mb-4" />
        <Skeleton width="40%" height={20} className="mb-4" />
        <Skeleton width="90%" height={300} />
      </div>
    );
  }

  // Хэрэв алдаа гарсан бол алдааны мессеж харуулах
  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 font-bold">Error: {error.message}</p>
      </div>
    );
  }

  // Хэрэв өгөгдөл байхгүй бол item байхгүй тухай мессеж харуулах
  if (!data || !data.getItemById) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 font-bold">Item not found</p>
      </div>
    );
  }

  // Өгөгдлийг олсон бол item-ийг харуулах
  const item = data.getItemById;

  return (
    <div className="w-full h-full flex flex-col items-center">
      <Header />
      <div className="w-full max-w-screen-lg p-4">
        <ItemOpen item={item} />
      </div>
    </div>
  );
}
