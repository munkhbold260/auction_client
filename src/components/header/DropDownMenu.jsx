import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { ExitToApp } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import { useRefreshToken } from "../hooks/useRefreshToken";
import { isAuthenticated } from "@/lib/authentication";

export default function DropDownMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    router.push("/");
  };

  useEffect(() => {
    // Хэрэглэгч нэвтэрсэн эсэхийг шалгах логик
    if (isAuthenticated()) {
      setIsLoggedIn(true);
      const email = localStorage.getItem("email");
      setUserEmail(email);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // Компонент ачаалагдах үед зөвхөн нэг удаа шалгана

  useEffect(() => {
    const tokenExpiry = localStorage.getItem("tokenExpiryTime");

    if (tokenExpiry && new Date().getTime() < parseInt(tokenExpiry)) {
      const timeRemaining = parseInt(tokenExpiry) - new Date().getTime();
      setCountdown(timeRemaining / 1000); // countdown in seconds

      const countdownInterval = setInterval(() => {
        const newTimeRemaining = parseInt(tokenExpiry) - new Date().getTime();
        setCountdown(newTimeRemaining / 1000);

        if (newTimeRemaining <= 0) {
          handleLogout();
          clearInterval(countdownInterval);
        }
      }, 1000);

      return () => clearInterval(countdownInterval);
    } else {
      handleLogout();
    }
  }, [countdown]); // countdown биш, isLoggedIn утгыг ажиглана

  // Dropdown гаднах click сонсох event listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Хэрэв гадна талд дарвал dropdown-ийг хаана
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { refreshToken, loading, error } = useRefreshToken();

  const handleTokenRefresh = async () => {
    try {
      const newToken = await refreshToken();
      console.log("New token:", newToken);

      // Токены хугацааг шинэчлэн тооцоолно (1 цагийн хугацаатай гэж үзвэл)
      const newExpiryTime = new Date().getTime() + 3600 * 1000; // 1 цагийн хугацаа
      localStorage.setItem("tokenExpiryTime", newExpiryTime); // Шинэ хугацааг localStorage дээр хадгална

      // Шинэ хугацаагаар countdown-ийг шинэчилнэ
      const timeRemaining = newExpiryTime - new Date().getTime();
      setCountdown(timeRemaining / 1000); // countdown in seconds
    } catch (err) {
      console.error("Failed to refresh token:", err);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-between">
      <nav className="relative dropdown-menu" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          <MenuIcon className="ml-2 w-6 h-6" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 w-48 mt-2 bg-white text-gray-800 rounded-lg shadow-lg">
            {!isLoggedIn ? (
              <Link href="/log-in">
                <p
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Нэвтрэх
                </p>
              </Link>
            ) : (
              <>
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-semibold text-red-500">
                    Холболт салах:
                    {Math.floor(countdown / 60)
                      .toString()
                      .padStart(2, "0")}
                    :
                    {Math.floor(countdown % 60)
                      .toString()
                      .padStart(2, "0")}
                  </p>

                  <button
                    onClick={handleTokenRefresh}
                    disabled={loading}
                    className="rounded-md bg-green-400 px-2 text-sm font-semibold"
                  >
                    {loading ? "Шинэчилж байна..." : "Холболт шинэчлэх"}
                  </button>
                  {error && <p>Error refreshing token: {error.message}</p>}
                  <p className="text-sm text-gray-600 mt-2">
                    Таны имэйл: {userEmail || "test"}
                  </p>
                </div>
                <Link href="/profile">
                  <p
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Профайл
                  </p>
                </Link>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                >
                  Гарах
                  <ExitToApp />
                </button>
              </>
            )}
            <Link href="/page2">
              <p
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Page 2
              </p>
            </Link>
            <Link href="/page3">
              <p
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Page 3
              </p>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
