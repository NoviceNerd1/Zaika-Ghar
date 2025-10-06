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
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <Link to="/" className="flex items-center">
          <h1 className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Zaika Ghar
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
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
            onThemeChange={setTheme}
          />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNav
            isAuthenticated={isAuthenticated}
            user={user}
            loading={loading}
            cartItemsCount={cartItemsCount}
            onProtectedNavigation={handleProtectedNavigation}
            onLogout={handleLogout}
            onThemeChange={setTheme}
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
    <div className="hidden md:flex items-center gap-8">
      <Link
        to="/"
        className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
      >
        Home
      </Link>

      {/* Protected Links */}
      {isAuthenticated ? (
        <>
          <Link
            to="/profile"
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            Profile
          </Link>
          <Link
            to="/order/status"
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            Order
          </Link>
        </>
      ) : (
        <>
          <button
            onClick={() => onProtectedNavigation("/profile")}
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            Profile
          </button>
          <button
            onClick={() => onProtectedNavigation("/order/status")}
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            Order
          </button>
        </>
      )}

      {/* Admin Menu */}
      {user?.admin && isAuthenticated && (
        <Menubar className="border-border">
          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer text-foreground data-[state=open]:bg-accent">
              Dashboard
            </MenubarTrigger>
            <MenubarContent className="bg-popover border-border">
              <Link to="/admin/restaurant">
                <MenubarItem className="cursor-pointer hover:bg-accent">
                  Restaurant
                </MenubarItem>
              </Link>
              <Link to="/admin/menu">
                <MenubarItem className="cursor-pointer hover:bg-accent">
                  Menu
                </MenubarItem>
              </Link>
              <Link to="/admin/orders">
                <MenubarItem className="cursor-pointer hover:bg-accent">
                  Orders
                </MenubarItem>
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
        <Avatar className="border-2 border-border">
          <AvatarImage src={user?.profilePicture} alt="profilephoto" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user?.fullname?.charAt(0) || "U"}
          </AvatarFallback>
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
      <Button variant="outline" size="icon" className="border-border">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="bg-popover border-border">
      <DropdownMenuItem
        onClick={() => onThemeChange("light")}
        className="cursor-pointer hover:bg-accent"
      >
        Light
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onThemeChange("dark")}
        className="cursor-pointer hover:bg-accent"
      >
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
    <Button variant="outline" size="icon" className="relative border-border">
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {itemCount}
        </span>
      )}
    </Button>
  );

  if (isAuthenticated) {
    return (
      <Link to="/cart" className="cursor-pointer">
        {cartContent}
      </Link>
    );
  }

  return (
    <button
      onClick={() => onProtectedNavigation("/cart")}
      className="cursor-pointer"
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
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button
        onClick={onLogout}
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    );
  }

  return (
    <Link to="/login">
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
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
  const { cart } = useCartStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size={"icon"}
          variant="outline"
          className="rounded-lg border-border"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-background border-border">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle className="text-foreground">Zaika Ghar</SheetTitle>
          <ThemeToggle onThemeChange={onThemeChange} />
        </SheetHeader>
        <Separator className="my-4 bg-border" />

        <div className="flex-1 space-y-2">
          {/* Protected Mobile Links */}
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-4 hover:bg-accent px-3 py-3 rounded-lg cursor-pointer text-foreground font-medium transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Link
                to="/order/status"
                className="flex items-center gap-4 hover:bg-accent px-3 py-3 rounded-lg cursor-pointer text-foreground font-medium transition-colors"
              >
                <HandPlatter className="h-5 w-5" />
                <span>Order</span>
              </Link>
              <Link
                to="/cart"
                className="flex items-center gap-4 hover:bg-accent px-3 py-3 rounded-lg cursor-pointer text-foreground font-medium transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({cartItemsCount})</span>
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => onProtectedNavigation("/profile")}
                className="flex items-center gap-4 hover:bg-accent px-3 py-3 rounded-lg cursor-pointer text-foreground font-medium transition-colors w-full text-left"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => onProtectedNavigation("/order/status")}
                className="flex items-center gap-4 hover:bg-accent px-3 py-3 rounded-lg cursor-pointer text-foreground font-medium transition-colors w-full text-left"
              >
                <HandPlatter className="h-5 w-5" />
                <span>Order</span>
              </button>
              <button
                onClick={() => onProtectedNavigation("/cart")}
                className="flex items-center gap-4 hover:bg-accent px-3 py-3 rounded-lg cursor-pointer text-foreground font-medium transition-colors w-full text-left"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({cart.length})</span>
              </button>
            </>
          )}

          {/* Admin Links */}
          {isAuthenticated && user?.admin && (
            <>
              <Link
                to="/admin/menu"
                className="flex items-center gap-4 hover:bg-accent px-3 py-3 rounded-lg cursor-pointer text-foreground font-medium transition-colors"
              >
                <SquareMenu className="h-5 w-5" />
                <span>Menu</span>
              </Link>
              <Link
                to="/admin/restaurant"
                className="flex items-center gap-4 hover:bg-accent px-3 py-3 rounded-lg cursor-pointer text-foreground font-medium transition-colors"
              >
                <UtensilsCrossed className="h-5 w-5" />
                <span>Restaurant</span>
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center gap-4 hover:bg-accent px-3 py-3 rounded-lg cursor-pointer text-foreground font-medium transition-colors"
              >
                <PackageCheck className="h-5 w-5" />
                <span>Restaurant Orders</span>
              </Link>
            </>
          )}
        </div>

        <SheetFooter className="flex flex-col gap-4 mt-6">
          {/* User Info */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user?.fullname?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <h1 className="font-semibold text-foreground text-sm">
                {user.fullname || "User"}
              </h1>
            </div>
          )}

          <SheetClose asChild>
            {loading ? (
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : isAuthenticated ? (
              <Button
                onClick={onLogout}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            ) : (
              <Link to="/login" className="w-full">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full flex items-center gap-2">
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
