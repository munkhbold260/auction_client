import Header from "@/components/header/Header";
import AllItems from "@/components/AllItems";

function Home() {
  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="w-full max-w-screen-lg bg-gray-200 flex flex-col items-center overflow-hidden">
        {/* Max-width нь дэлгэцийн хэмжээнээс хамаарч өөрчлөгдөнө */}
        <div className="w-full">
          <Header />
        </div>
        <div className="w-full">
          <AllItems />
        </div>
      </div>
    </div>
  );
}

export default Home;
