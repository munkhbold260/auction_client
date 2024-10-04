import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  RESET_PASSWORD_MUTATION,
  SEND_OTP_MUTATION,
  VERIFY_OTP_MUTATION,
} from "@/graphql/mutation";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [submittedOtp, setSubmittedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Apollo мутацуудыг ашиглаж байна
  const [sendOtp] = useMutation(SEND_OTP_MUTATION);
  const [verifyOtp] = useMutation(VERIFY_OTP_MUTATION);
  const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION);

  // OTP илгээх функц
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await sendOtp({
        variables: { email }, // useMutation-ийн функцыг дуудаж байна
      });

      setOtp(data.sendOtp.otp); // Зөв бичиглэлтэй хувьсагч
      setOtpSent(true);
      toast.success("OTP илгээгдлээ");
    } catch (error) {
      toast.error("OTP илгээхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  // OTP баталгаажуулах функц
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const { data } = await verifyOtp({
        variables: { email, otp: submittedOtp },
      });

      if (data.verifyOtp.success) {
        setOtpVerified(true);
        toast.success("OTP баталгаажлаа");
      } else {
        toast.error("OTP код буруу байна");
      }
    } catch (error) {
      toast.error("OTP баталгаажуулахад алдаа гарлаа");
    }
  };

  // Нууц үг солих функц
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Нууц үг тохирохгүй байна");
      return;
    }

    setLoading(true);

    try {
      const { data } = await resetPassword({
        variables: { email, otp: submittedOtp, newPassword },
      });

      if (data.resetPassword.success) {
        toast.success("Нууц үг амжилттай шинэчлэгдлээ");
        setTimeout(() => {
          router.push("/log-in"); // Нэвтрэх хуудас руу шилжүүлэх
        }, 2000);
      } else {
        toast.error("Нууц үг шинэчлэхэд алдаа гарлаа");
      }
    } catch (error) {
      toast.error("Нууц үг шинэчлэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          {otpVerified ? "Нууц үгээ шинэчлэх" : "Нууц үгээ мартсан уу?"}
        </h2>

        {!otpSent && !otpVerified && (
          <form onSubmit={handleSendOtp} className="space-y-6">
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

            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "OTP илгээж байна..." : "OTP илгээх"}
            </button>
          </form>
        )}

        {otpSent && !otpVerified && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP код оруулах
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={submittedOtp}
                onChange={(e) => setSubmittedOtp(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              OTP баталгаажуулах
            </button>
          </form>
        )}

        {otpVerified && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                Шинэ нууц үг
              </label>
              <input
                id="new-password"
                name="new-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Нууц үгийг баталгаажуулах
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Нууц үгийг шинэчилж байна..." : "Нууц үг шинэчлэх"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
