import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "@/graphql/queries"; // Query-г импортлох

export default function Profile() {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // localStorage нь зөвхөн клиент талд байдаг тул useEffect дотор ашиглаж байна
    const storedUserid = localStorage.getItem("userid");
    setUserId(storedUserid);
  }, []); // Зөвхөн анхны рендер дээр нэг удаа ажиллана
  console.log("userId", userId);
  // Хэрэв userid байгаа бол GraphQL query-г ашиглан хэрэглэгчийн мэдээллийг авах
  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { userid: userId },
    fetchPolicy: "cache-first",
    skip: !userId, // Хэрэв userid байхгүй бол query-г алгасах
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log("data", data);
  const user = data?.getUserById;
  console.log("user", user);

  return (
    <div>
      <h1>Profile</h1>
      {user ? (
        <div>
          <p>User ID: {user.userid}</p>
          <p>
            Name: {user.firstname} {user.lastname}
          </p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
        </div>
      ) : (
        <p>No user data found</p>
      )}
    </div>
  );
}
