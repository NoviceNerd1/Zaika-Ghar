import { Link, useNavigate } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  HandPlatter,
  Loader2,
  Menu,
  Moon,
  PackageCheck,
  ShoppingCart,
  SquareMenu,
  Sun,
  User,
  UtensilsCrossed,
  LogOut,
  LogIn,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/useCartStore";
import { useThemeStore, type Theme } from "@/store/useThemeStore";

// ✅ Better Type definitions - remove 'any' types
interface User {
  admin?: boolean;
  profilePicture?: string;
  fullname?: string;
}

interface NavLinksProps {
  isAuthenticated: boolean;
  user: User | null;
  onProtectedNavigation: (path: string) => void;
}

interface NavActionsProps {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  cartItemsCount: number;
  onProtectedNavigation: (path: string) => void;
  onLogout: () => void;
  onThemeChange: (theme: Theme) => void; // ✅ Use Theme type instead of string
}

interface ThemeToggleProps {
  onThemeChange: (theme: Theme) => void; // ✅ Use Theme type
}

interface CartIconProps {
  itemCount: number;
  isAuthenticated: boolean;
  onProtectedNavigation: (path: string) => void;
}

interface AuthButtonProps {
  isAuthenticated: boolean;
  loading: boolean;
  onLogout: () => void;
}

interface MobileNavProps {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  cartItemsCount: number;
  onProtectedNavigation: (path: string) => void;
  onLogout: () => void;
  onThemeChange: (theme: Theme) => void; // ✅ Use Theme type
}

const Navbar = () => {
  const { user, loading, logout, isAuthenticated } = useUserStore();
  const { cart } = useCartStore();
  const { setTheme } = useThemeStore();
  const navigate = useNavigate();

  // ✅ DRY: Extract repeated logic
  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const cartItemsCount = cart.length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between h-14">
        <Link to="/">
          <h1 className="font-bold md:font-extrabold text-2xl">Zaika Ghar</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <NavLinks
            isAuthenticated={isAuthenticated}
            user={user}
            onProtectedNavigation={handleProtectedNavigation}
          />

          <NavActions
            isAuthenticated={isAuthenticated}
            user={user}
            loading={loading}
            cartItemsCount={cartItemsCount}
            onProtectedNavigation={handleProtectedNavigation}
            onLogout={handleLogout}
            onThemeChange={setTheme} // ✅ Now matches the type
          />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden lg:hidden">
          <MobileNav
            isAuthenticated={isAuthenticated}
            user={user}
            loading={loading}
            cartItemsCount={cartItemsCount}
            onProtectedNavigation={handleProtectedNavigation}
            onLogout={handleLogout}
            onThemeChange={setTheme} // ✅ Now matches the type
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

// ✅ SRP: Separate navigation links
const NavLinks = ({
  isAuthenticated,
  user,
  onProtectedNavigation,
}: NavLinksProps) => {
  return (
    <div className="hidden md:flex items-center gap-6">
      <Link to="/">Home</Link>

      {/* Protected Links */}
      {isAuthenticated ? (
        <>
          <Link to="/profile">Profile</Link>
          <Link to="/order/status">Order</Link>
        </>
      ) : (
        <>
          <button
            onClick={() => onProtectedNavigation("/profile")}
            className="hover:text-orange transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => onProtectedNavigation("/order/status")}
            className="hover:text-orange transition-colors"
          >
            Order
          </button>
        </>
      )}

      {/* Admin Menu */}
      {user?.admin && isAuthenticated && (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Dashboard</MenubarTrigger>
            <MenubarContent>
              <Link to="/admin/restaurant">
                <MenubarItem>Restaurant</MenubarItem>
              </Link>
              <Link to="/admin/menu">
                <MenubarItem>Menu</MenubarItem>
              </Link>
              <Link to="/admin/orders">
                <MenubarItem>Orders</MenubarItem>
              </Link>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )}
    </div>
  );
};

// ✅ SRP: Separate action buttons
const NavActions = ({
  isAuthenticated,
  user,
  loading,
  cartItemsCount,
  onProtectedNavigation,
  onLogout,
  onThemeChange,
}: NavActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <ThemeToggle onThemeChange={onThemeChange} />

      <CartIcon
        itemCount={cartItemsCount}
        isAuthenticated={isAuthenticated}
        onProtectedNavigation={onProtectedNavigation}
      />

      {isAuthenticated && user && (
        <Avatar>
          <AvatarImage src={user?.profilePicture} alt="profilephoto" />
          <AvatarFallback>{user?.fullname?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      )}

      <AuthButton
        isAuthenticated={isAuthenticated}
        loading={loading}
        onLogout={onLogout}
      />
    </div>
  );
};

// ✅ DRY: Reusable theme toggle
const ThemeToggle = ({ onThemeChange }: ThemeToggleProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => onThemeChange("light")}>
        Light
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onThemeChange("dark")}>
        Dark
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// ✅ DRY: Reusable cart icon
const CartIcon = ({
  itemCount,
  isAuthenticated,
  onProtectedNavigation,
}: CartIconProps) => {
  const cartContent = (
    <>
      <ShoppingCart />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </>
  );

  if (isAuthenticated) {
    return (
      <Link to="/cart" className="relative cursor-pointer">
        {cartContent}
      </Link>
    );
  }

  return (
    <button
      onClick={() => onProtectedNavigation("/cart")}
      className="relative cursor-pointer"
    >
      {cartContent}
    </button>
  );
};

// ✅ DRY: Reusable auth button
const AuthButton = ({
  isAuthenticated,
  loading,
  onLogout,
}: AuthButtonProps) => {
  if (loading) {
    return (
      <Button className="bg-orange hover:bg-hoverOrange">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button
        onClick={onLogout}
        className="bg-orange hover:bg-hoverOrange flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    );
  }

  return (
    <Link to="/login">
      <Button className="bg-orange hover:bg-hoverOrange flex items-center gap-2">
        <LogIn className="w-4 h-4" />
        Login
      </Button>
    </Link>
  );
};

const MobileNav = ({
  isAuthenticated,
  user,
  loading,
  cartItemsCount,
  onProtectedNavigation,
  onLogout,
  onThemeChange,
}: MobileNavProps) => {
  // ✅ Remove unused cartItemsCount
  const { cart } = useCartStore(); // Only need cart for mobile display

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size={"icon"}
          className="rounded-full bg-gray-200 text-black hover:bg-gray-200"
          variant="outline"
        >
          <Menu size={"18"} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>Zaika Ghar</SheetTitle>
          <ThemeToggle onThemeChange={onThemeChange} />
        </SheetHeader>
        <Separator className="my-2" />
        <SheetDescription className="flex-1">
          {/* Protected Mobile Links */}
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
              >
                <User />
                <span>Profile</span>
              </Link>
              <Link
                to="/order/status"
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
              >
                <HandPlatter />
                <span>Order</span>
              </Link>
              <Link
                to="/cart"
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
              >
                <ShoppingCart />
                <span>Cart ({cartItemsCount})</span>
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => onProtectedNavigation("/profile")}
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium w-full text-left"
              >
                <User />
                <span>Profile</span>
              </button>
              <button
                onClick={() => onProtectedNavigation("/order/status")}
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium w-full text-left"
              >
                <HandPlatter />
                <span>Order</span>
              </button>
              <button
                onClick={() => onProtectedNavigation("/cart")}
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium w-full text-left"
              >
                <ShoppingCart />
                <span>Cart ({cart.length})</span>
              </button>
            </>
          )}

          {/* Admin Links - Only show when authenticated and admin */}
          {isAuthenticated && user?.admin && (
            <>
              <Link
                to="/admin/menu"
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
              >
                <SquareMenu />
                <span>Menu</span>
              </Link>
              <Link
                to="/admin/restaurant"
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
              >
                <UtensilsCrossed />
                <span>Restaurant</span>
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
              >
                <PackageCheck />
                <span>Restaurant Orders</span>
              </Link>
            </>
          )}
        </SheetDescription>
        <SheetFooter className="flex flex-col gap-4">
          {/* User Info - Only show when authenticated */}
          {isAuthenticated && user && (
            <div className="flex flex-row items-center gap-2">
              <Avatar>
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>
                  {user?.fullname?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <h1 className="font-bold">{user.fullname || "User"}</h1>
            </div>
          )}

          <SheetClose asChild>
            {loading ? (
              <Button className="bg-orange hover:bg-hoverOrange w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : isAuthenticated ? (
              <Button
                onClick={onLogout}
                className="bg-orange hover:bg-hoverOrange w-full flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            ) : (
              <Link to="/login" className="w-full">
                <Button className="bg-orange hover:bg-hoverOrange w-full flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            )}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
