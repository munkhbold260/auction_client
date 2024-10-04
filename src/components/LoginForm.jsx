import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { setToken } from "@/lib/authentication";
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGIN_MUTATION } from "@/graphql/mutation";
import { GET_USER_BY_ID } from "@/graphql/queries";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const [success, setSuccess] = useState(false); // Амжилттай нэвтэрсэн төлөв

  const client = useApolloClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      const tokenExpiryTime = new Date().getTime() + 3600 * 1000; // 1 цагийн хугацаа
      const user = data.login.user;
      setToken(data.login.token, tokenExpiryTime, JSON.stringify(user));

      client.writeQuery({
        query: GET_USER_BY_ID,
        data: {
          getUserById: user,
        },
      });
      setSuccess(true); // Амжилттай нэвтэрсэн үед төлөвийг шинэчилнэ
      toast.success("Амжилттай нэвтэрлээ");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (err) {
      // Backend-ээс ирсэн алдааны мессежийг харуулах
      toast.error(err?.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-0">
      <div>
        <div className="w-full flex flex-col items-center mb-[50px] font-extrabold text-4xl">
          <Link href={"/"}>
            <p>Welcome to My Auction</p>
          </Link>
        </div>
        <div className="w-full max-w-sm p-6 space-y-4 bg-white rounded-lg shadow-md sm:max-w-md">
          <h2 className="text-xl font-bold text-center text-gray-700 sm:text-2xl">
            Нэвтрэх
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Имэйл
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Нууц үг
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? "нуух" : "харуулах"}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Link href="/forgotPassword">
                <p className="text-sm text-blue-600 hover:text-blue-900">
                  Нууц үгээ мартсан уу?
                </p>
              </Link>
            </div>
            <div>
              <button
                type="submit"
                className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : success
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={loading || success} // Амжилттай нэвтэрсэн үед товчийг идэвхгүй болгоно
              >
                {loading
                  ? "Нэвтэрж байна..."
                  : success
                  ? "Амжилттай нэвтэрлээ"
                  : "Нэвтрэх"}
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600">No account? </p>
            <Link href="/sign-up">
              <p className="text-blue-600 hover:text-blue-800">Бүртгүүлэх</p>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
