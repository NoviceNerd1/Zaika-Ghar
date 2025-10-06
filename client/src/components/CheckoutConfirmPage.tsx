import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";
import { type CheckoutSessionRequest } from "@/types/orderType";
import { useCartStore } from "@/store/useCartStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useOrderStore } from "@/store/useOrderStore";
import { Loader2, MapPin, User, Mail, Phone, Home, Globe } from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

const CheckoutConfirmPage = ({
  open,
  setOpen,
  restaurantId,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  restaurantId?: string;
}) => {
  const { user } = useUserStore();
  const [input, setInput] = useState({
    name: user?.fullname || "",
    email: user?.email || "",
    contact: user?.contact?.toString() || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
  });
  const { cart, getCartTotal, getCartItemsCount, clearCart } = useCartStore();
  const { restaurant, singleRestaurant } = useRestaurantStore();
  const { createCheckoutSession, loading } = useOrderStore();

  // Determine which restaurant ID to use (priority order)
  const getRestaurantId = () => {
    if (restaurantId) return restaurantId;
    if (singleRestaurant?._id) return singleRestaurant._id;
    if (restaurant?._id) return restaurant._id;
    return null;
  };

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const checkoutHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentRestaurantId = getRestaurantId();

    if (!currentRestaurantId) {
      toast.error(
        "Restaurant information is missing. Please try adding items to cart again."
      );
      return;
    }

    if (
      !input.name ||
      !input.contact ||
      !input.address ||
      !input.city ||
      !input.country
    ) {
      toast.error("Please fill in all required delivery details.");
      return;
    }

    try {
      const checkoutData: CheckoutSessionRequest = {
        cartItems: cart.map((cartItem) => ({
          menuId: cartItem._id,
          name: cartItem.name,
          image: cartItem.image,
          price: cartItem.price,
          quantity: cartItem.quantity,
        })),
        deliveryDetails: input,
        restaurantId: currentRestaurantId,
        createdAt: new Date(),
      };

      await createCheckoutSession(checkoutData);
      clearCart();

      toast.success("Order placed successfully! Your cart has been cleared");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to create checkout session. Please try again.");
    }
  };

  // Calculate totals
  const totalAmount = getCartTotal();
  const totalItems = getCartItemsCount();
  const deliveryFee = 40;
  const grandTotal = totalAmount + deliveryFee;

  const currentRestaurantId = getRestaurantId();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl bg-card rounded-2xl shadow-2xl border-border">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-card-foreground">
                Delivery Details
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Confirm your delivery information and proceed to payment
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="bg-accent rounded-xl p-4 border border-border">
            <h3 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Order Summary
            </h3>
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {item.quantity}
                    </Badge>
                    <span className="text-card-foreground/80 line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-medium text-card-foreground">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="my-3 bg-border" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Items ({totalItems})
                </span>
                <span className="font-medium text-card-foreground">
                  ₹{totalAmount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium text-card-foreground">
                  ₹{deliveryFee}
                </span>
              </div>
              <Separator className="bg-border" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-card-foreground">Total Amount</span>
                <span className="text-primary">₹{grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Delivery Form */}
          <form onSubmit={checkoutHandler} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium flex items-center gap-2 text-card-foreground"
                >
                  <User className="w-4 h-4 text-primary" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  required
                  className="rounded-lg focus:ring-2 focus:ring-primary/20 border-border bg-background text-card-foreground"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium flex items-center gap-2 text-card-foreground"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  disabled
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="rounded-lg bg-accent border-border text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="contact"
                  className="text-sm font-medium flex items-center gap-2 text-card-foreground"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  Contact Number *
                </Label>
                <Input
                  id="contact"
                  type="text"
                  name="contact"
                  value={input.contact}
                  onChange={changeEventHandler}
                  required
                  className="rounded-lg focus:ring-2 focus:ring-primary/20 border-border bg-background text-card-foreground"
                  placeholder="Your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="city"
                  className="text-sm font-medium flex items-center gap-2 text-card-foreground"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  City *
                </Label>
                <Input
                  id="city"
                  type="text"
                  name="city"
                  value={input.city}
                  onChange={changeEventHandler}
                  required
                  className="rounded-lg focus:ring-2 focus:ring-primary/20 border-border bg-background text-card-foreground"
                  placeholder="Your city"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium flex items-center gap-2 text-card-foreground"
                >
                  <Home className="w-4 h-4 text-primary" />
                  Delivery Address *
                </Label>
                <Input
                  id="address"
                  type="text"
                  name="address"
                  value={input.address}
                  onChange={changeEventHandler}
                  required
                  className="rounded-lg focus:ring-2 focus:ring-primary/20 border-border bg-background text-card-foreground"
                  placeholder="Full delivery address"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-sm font-medium flex items-center gap-2 text-card-foreground"
                >
                  <Globe className="w-4 h-4 text-primary" />
                  Country *
                </Label>
                <Input
                  id="country"
                  type="text"
                  name="country"
                  value={input.country}
                  onChange={changeEventHandler}
                  required
                  className="rounded-lg focus:ring-2 focus:ring-primary/20 border-border bg-background text-card-foreground"
                  placeholder="Your country"
                />
              </div>
            </div>

            <DialogFooter className="pt-6">
              {loading ? (
                <Button
                  disabled
                  className="w-full bg-primary hover:bg-primary/90 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 text-primary-foreground"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Your Order...
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!currentRestaurantId || cart.length === 0}
                  className="w-full bg-primary hover:bg-primary/90 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Continue To Payment - ₹{grandTotal}
                </Button>
              )}
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutConfirmPage;
