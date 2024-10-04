import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router"; // Next.js router
import { SIGNUP_MUTATION } from "@/graphql/mutation";

// Нууц үгийн хүч шалгах функц
const checkPasswordStrength = (password) => {
  let strength = 0;
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[\W]/.test(password),
  };

  strength = Object.values(criteria).filter(Boolean).length;

  return { strength, criteria };
};

export default function SignUpForm() {
  const router = useRouter(); // Router to redirect after signup
  const newId = nanoid();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userid: newId,
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [passwordStrength, setPasswordStrength] = useState(""); // Нууц үгийн хүч
  const [criteria, setCriteria] = useState({}); // Password criteria
  const [isPasswordTyped, setIsPasswordTyped] = useState(false); // Хэрэглэгч нууц үг бичиж эхэлсэн эсэх

  // Apollo Client-ийн useMutation hook ашиглах
  const [signUp] = useMutation(SIGNUP_MUTATION);

  // Input утгуудыг шинэчлэх функц
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      setIsPasswordTyped(true); // Хэрэглэгч нууц үг бичиж эхэлсэн эсэхийг тэмдэглэх
      const { strength, criteria } = checkPasswordStrength(value); // Нууц үгийн хүч шалгах
      setPasswordStrength(strength);
      setCriteria(criteria);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Нууц үг таарахгүй байна");
      return;
    }
    setLoading(true); // Start loading

    try {
      const { data } = await signUp({
        variables: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          userid: formData.userid,
        },
      });
      console.log("variables", data);
      if (data) {
        toast.success("Амжилттай бүртгэгдлээ.");
        setTimeout(() => {
          router.push("/log-in"); // Redirect to login page after a short delay
        }, 2000); // Adjust delay as needed
      }
    } catch (err) {
      // Backend-ээс ирсэн алдааны мессежийг харуулах
      const errorMessage = err.graphQLErrors?.[0]?.message || err.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false); // End loading
    }
  };
  // Товчийг идэвхжүүлэх эсэхийг шалгах функц
  const isSignUpButtonDisabled = () => {
    return passwordStrength < 5 || loading;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-0">
      <ToastContainer />
      <div className="w-full max-w-sm p-6 space-y-4 bg-white rounded-lg shadow-md sm:max-w-md">
        <h2 className="text-xl font-bold text-center text-gray-700 sm:text-2xl">
          Sign Up
        </h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Нэр
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

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
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Утасны дугаар
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              required
              value={formData.phone}
              onChange={handleChange}
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
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {isPasswordTyped && ( // Зөвлөмжийг зөвхөн нууц үг бичиж эхэлсний дараа харуулна
              <>
                <p
                  className={`text-sm mt-2 ${
                    passwordStrength >= 4
                      ? "text-green-600"
                      : passwordStrength >= 3
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {passwordStrength >= 4
                    ? "Strong password"
                    : passwordStrength >= 3
                    ? "Medium password"
                    : "Weak password"}
                </p>
                <ul className="text-sm mt-2 text-gray-600">
                  <li
                    className={
                      criteria.length ? "text-green-600" : "text-red-600"
                    }
                  >
                    &bull; 8-с дээш тэмдэгт оруулах.
                  </li>
                  <li
                    className={
                      criteria.uppercase ? "text-green-600" : "text-red-600"
                    }
                  >
                    &bull; Том үсэг орсон байх.
                  </li>
                  <li
                    className={
                      criteria.lowercase ? "text-green-600" : "text-red-600"
                    }
                  >
                    &bull; Жижиг үсэг орсон байх.
                  </li>
                  <li
                    className={
                      criteria.number ? "text-green-600" : "text-red-600"
                    }
                  >
                    &bull;Тоо орсон байх.
                  </li>
                  <li
                    className={
                      criteria.specialChar ? "text-green-600" : "text-red-600"
                    }
                  >
                    &bull; Тусгай тэмдэгт орсон байх.
                  </li>
                </ul>
              </>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Нууц үг давтана уу
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSignUpButtonDisabled()} // Товчийг идэвхгүй болгох шалгуур
              className={`w-full px-4 py-2 text-sm font-medium text-white ${
                isSignUpButtonDisabled()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {loading ? "Бүртгэгдэж байна..." : "Бүртгүүлэх"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Link href="/log-in" className="text-blue-600 hover:text-blue-800">
            Нэвтрэх
          </Link>
        </div>
      </div>
    </div>
  );
}
