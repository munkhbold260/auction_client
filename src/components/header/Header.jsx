import DropDownMenu from "./DropDownMenu";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-gray-400 flex justify-between items-center p-4 sticky top-0 z-50">
      <div className="flex items-center">
        <Link href="/">
          <div className="flex items-center">
            <HomeIcon className="text-xl md:text-2xl" />
            <span className="text-lg md:text-2xl font-bold ml-2">Auction</span>
          </div>
        </Link>
      </div>
      <div>
        <DropDownMenu />
      </div>
    </header>
  );
}
