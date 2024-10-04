import { useQuery } from "@apollo/client";
import CategoryCard from "@/components/cards/CategoryCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Skeleton-ийн CSS-ийг оруулах
import { GET_CATEGORIES } from "../graphql/queries"; // Query импортлох

const arr = [1, 2, 3, 4, 5, 6];

export default function AllItems() {
  const { data, loading, error } = useQuery(GET_CATEGORIES);
  // , {
  // fetchPolicy: "cache-first", // Эхлээд кэшийг шалгана, кэшэнд байхгүй бол серверээс татна
  // });

  // Ачааллах үед Skeleton харуулах
  if (loading) {
    return (
      <div className="bg-red-200 flex flex-col justify-between">
        <div className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex flex-col">
          {Array(6)
            .fill()
            .map((_, index) => (
              <div key={index} className="">
                <div className="mb-1">
                  <Skeleton height={20} width={50} />
                </div>
                <div className="flex gap-1">
                  {arr.map((_, subIndex) => (
                    <div key={subIndex} className="mr-4">
                      <Skeleton height={200} width={125} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // Алдаа гарсан тохиолдолд алдааны мессеж харуулах
  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  // Өгөгдлийг хүлээн авсан үед категориудыг харуулах
  return (
    <div className="bg-red-200 min-h-screen flex flex-col justify-between">
      <div className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 flex flex-col">
        {data.getCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
