import { useMutation } from "@apollo/client";
import { RENEW_TOKEN_MUTATION } from "@/graphql/mutation"; // Mutation-ийг зөв замаар импортлоорой

// Токен шинэчлэх функц
export const useRefreshToken = () => {
  const [renewToken, { data, loading, error }] =
    useMutation(RENEW_TOKEN_MUTATION);

  const refreshToken = async () => {
    try {
      // Одоогийн токеныг localStorage-с авна
      const currentToken = localStorage.getItem("token");
      if (!currentToken) {
        throw new Error("No token found. Please login again.");
      }

      // Токеныг шинэчлэх хүсэлт
      const response = await renewToken({
        variables: { token: currentToken },
      });

      const { token } = response.data.renewToken;

      // Шинэ токеныг localStorage-д хадгална
      console.log("irsen shine token", token);
      localStorage.setItem("token", token);

      // Токены хугацааг 1 цаг гэж тооцоолж localStorage дээр хадгална
      const tokenExpiryTime = new Date().getTime() + 3600 * 1000; // 1 цагийн хугацаа
      localStorage.setItem("tokenExpiryTime", tokenExpiryTime);

      console.log("Token and expiry time successfully refreshed");
      return token;
    } catch (err) {
      console.error("Token refresh error:", err);
      throw err;
    }
  };

  return { refreshToken, loading, error };
};
