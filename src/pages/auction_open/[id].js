import BidChat from "@/components/auction/BidChat";
import { useEffect, useState } from "react";

export default function Page() {
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Хэрэв клиент тал дээр ажиллаж байгаа бол
      const user = localStorage.getItem("user");
      setLoggedUser(user ? JSON.parse(user) : null);
    }
  }, []);

  // loggedUser байгаа эсэхийг шалгана
  if (!loggedUser) {
    return <p>Ачааллаж байна...</p>;
  }
  console.log("loggedUser", loggedUser);
  return (
    <div>
      <BidChat loggedUser={loggedUser} />
    </div>
  );
}
