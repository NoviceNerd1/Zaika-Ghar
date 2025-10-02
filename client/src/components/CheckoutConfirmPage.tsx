// import {
//   type Dispatch,
//   type FormEvent,
//   type SetStateAction,
//   useState,
//   useEffect,
// } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
// } from "./ui/dialog";
// import { DialogTitle } from "@radix-ui/react-dialog";
// import { Label } from "./ui/label";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import { useUserStore } from "@/store/useUserStore";
// import { type CheckoutSessionRequest } from "@/types/orderType";
// import { useCartStore } from "@/store/useCartStore";
// import { useRestaurantStore } from "@/store/useRestaurantStore";
// import { useOrderStore } from "@/store/useOrderStore";
// import { Loader2, MapPin, User, Mail, Phone, Home, Globe } from "lucide-react";
// import { Badge } from "./ui/badge";
// import { Separator } from "./ui/separator";
// import { toast } from "sonner";

// const CheckoutConfirmPage = ({
//   open,
//   setOpen,
//   restaurantId, // Add this prop to pass the restaurant ID
// }: {
//   open: boolean;
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   restaurantId?: string; // Add this optional prop
// }) => {
//   const { user } = useUserStore();
//   const [input, setInput] = useState({
//     name: user?.fullname || "",
//     email: user?.email || "",
//     contact: user?.contact?.toString() || "",
//     address: user?.address || "",
//     city: user?.city || "",
//     country: user?.country || "",
//   });
//   const { cart, getCartTotal, getCartItemsCount } = useCartStore();
//   const { restaurant, singleRestaurant } = useRestaurantStore(); // Get both
//   const { createCheckoutSession, loading } = useOrderStore();

//   // Debug function to check all restaurant ID sources
//   const debugRestaurantIds = () => {
//     const cartState = useCartStore.getState();

//     console.log("🔍 Restaurant ID Debug Info:", {
//       // From props (passed from Cart component)
//       propRestaurantId: restaurantId,

//       // From cart store
//       cartStoreRestaurantId: cartState.restaurantId,
//       cartStoreRestaurantName: cartState.restaurantName,

//       // From restaurant store
//       singleRestaurantId: singleRestaurant?._id,
//       singleRestaurantName: singleRestaurant?.restaurantName,
//       restaurantId: restaurant?._id,
//       restaurantName: restaurant?.restaurantName,

//       // Current cart state
//       cartItems: cartState.cart.length,
//       cartItemsDetails: cartState.cart.map((item) => ({
//         id: item._id,
//         name: item.name,
//         quantity: item.quantity,
//       })),
//     });
//   };

//   // Determine which restaurant ID to use (priority order)
//   const getRestaurantId = () => {
//     console.log("🔄 Determining restaurant ID...");

//     // 1. Use the passed restaurantId prop (highest priority)
//     if (restaurantId) {
//       console.log("✅ Using restaurantId from props:", restaurantId);
//       return restaurantId;
//     }

//     // 2. Use singleRestaurant (from restaurant detail page)
//     if (singleRestaurant?._id) {
//       console.log("✅ Using singleRestaurant ID:", singleRestaurant._id);
//       return singleRestaurant._id;
//     }

//     // 3. Use restaurant (user's restaurant)
//     if (restaurant?._id) {
//       console.log("✅ Using restaurant ID:", restaurant._id);
//       return restaurant._id;
//     }

//     // 4. Try to get from cart store as fallback
//     const { restaurantId: cartRestaurantId } = useCartStore.getState();
//     if (cartRestaurantId) {
//       console.log("✅ Using restaurantId from cart store:", cartRestaurantId);
//       return cartRestaurantId;
//     }

//     console.log("❌ No restaurant ID found from any source");
//     return null;
//   };

//   // Debug effect when dialog opens
//   useEffect(() => {
//     if (open) {
//       console.log("🎯 Checkout Dialog Opened - Debugging Restaurant ID");
//       debugRestaurantIds();

//       const currentRestaurantId = getRestaurantId();
//       console.log("🎯 Final Restaurant ID to be used:", currentRestaurantId);

//       if (!currentRestaurantId) {
//         toast.error(
//           "Restaurant information not found. Please add items to cart again."
//         );
//       }
//     }
//   }, [open]);

//   const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setInput({ ...input, [name]: value });
//   };

//   const checkoutHandler = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const currentRestaurantId = getRestaurantId();

//     // Validate restaurant ID
//     if (!currentRestaurantId) {
//       toast.error(
//         "Restaurant information is missing. Please try adding items to cart again."
//       );
//       console.error("Restaurant ID is undefined. Debug info:");
//       debugRestaurantIds();
//       return;
//     }

//     // Validate form data
//     if (
//       !input.name ||
//       !input.contact ||
//       !input.address ||
//       !input.city ||
//       !input.country
//     ) {
//       toast.error("Please fill in all required delivery details.");
//       return;
//     }

//     // API implementation start from here
//     try {
//       const checkoutData: CheckoutSessionRequest = {
//         cartItems: cart.map((cartItem) => ({
//           menuId: cartItem._id,
//           name: cartItem.name,
//           image: cartItem.image,
//           price: cartItem.price,
//           quantity: cartItem.quantity,
//         })),
//         deliveryDetails: input,
//         restaurantId: currentRestaurantId, // Use the determined restaurant ID
//       };

//       console.log("✅ Final checkout data:", checkoutData);
//       await createCheckoutSession(checkoutData);
//     } catch (error) {
//       console.log("❌ Checkout error:", error);
//       toast.error("Failed to create checkout session. Please try again.");
//     }
//   };

//   // Since utility methods are defined in the store, we can use them directly
//   const totalAmount = getCartTotal();
//   const totalItems = getCartItemsCount();
//   const deliveryFee = 40;
//   const grandTotal = totalAmount + deliveryFee;

//   const currentRestaurantId = getRestaurantId();

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
//         <DialogHeader className="space-y-3">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-orange/10 rounded-xl">
//               <MapPin className="w-6 h-6 text-orange" />
//             </div>
//             <div>
//               <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
//                 Delivery Details
//               </DialogTitle>
//               <DialogDescription className="text-gray-600 dark:text-gray-400">
//                 Confirm your delivery information and proceed to payment
//               </DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <div className="grid lg:grid-cols-2 gap-6">
//           {/* Order Summary */}
//           <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
//             <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
//               <span className="w-2 h-2 bg-orange rounded-full"></span>
//               Order Summary
//             </h3>
//             <div className="space-y-3">
//               {cart.map((item) => (
//                 <div
//                   key={item._id}
//                   className="flex items-center justify-between text-sm"
//                 >
//                   <div className="flex items-center gap-2">
//                     <Badge
//                       variant="secondary"
//                       className="bg-orange/10 text-orange"
//                     >
//                       {item.quantity}
//                     </Badge>
//                     <span className="text-gray-700 dark:text-gray-300 line-clamp-1">
//                       {item.name}
//                     </span>
//                   </div>
//                   <span className="font-medium text-gray-900 dark:text-white">
//                     ₹{item.price * item.quantity}
//                   </span>
//                 </div>
//               ))}
//             </div>
//             <Separator className="my-3" />
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600 dark:text-gray-400">
//                   Items ({totalItems})
//                 </span>
//                 <span className="font-medium">₹{totalAmount}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600 dark:text-gray-400">
//                   Delivery Fee
//                 </span>
//                 <span className="font-medium">₹{deliveryFee}</span>
//               </div>
//               <Separator />
//               <div className="flex justify-between text-lg font-bold">
//                 <span className="text-gray-900 dark:text-white">
//                   Total Amount
//                 </span>
//                 <span className="text-orange">₹{grandTotal}</span>
//               </div>
//             </div>
//           </div>

//           {/* Delivery Form */}
//           <form onSubmit={checkoutHandler} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="name"
//                   className="text-sm font-medium flex items-center gap-2"
//                 >
//                   <User className="w-4 h-4 text-orange" />
//                   Full Name *
//                 </Label>
//                 <Input
//                   id="name"
//                   type="text"
//                   name="name"
//                   value={input.name}
//                   onChange={changeEventHandler}
//                   required
//                   className="rounded-lg focus:ring-2 focus:ring-orange/20 border-gray-300 dark:border-gray-600"
//                   placeholder="Enter your full name"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label
//                   htmlFor="email"
//                   className="text-sm font-medium flex items-center gap-2"
//                 >
//                   <Mail className="w-4 h-4 text-orange" />
//                   Email Address
//                 </Label>
//                 <Input
//                   id="email"
//                   disabled
//                   type="email"
//                   name="email"
//                   value={input.email}
//                   onChange={changeEventHandler}
//                   className="rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label
//                   htmlFor="contact"
//                   className="text-sm font-medium flex items-center gap-2"
//                 >
//                   <Phone className="w-4 h-4 text-orange" />
//                   Contact Number *
//                 </Label>
//                 <Input
//                   id="contact"
//                   type="text"
//                   name="contact"
//                   value={input.contact}
//                   onChange={changeEventHandler}
//                   required
//                   className="rounded-lg focus:ring-2 focus:ring-orange/20 border-gray-300 dark:border-gray-600"
//                   placeholder="Your phone number"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label
//                   htmlFor="city"
//                   className="text-sm font-medium flex items-center gap-2"
//                 >
//                   <MapPin className="w-4 h-4 text-orange" />
//                   City *
//                 </Label>
//                 <Input
//                   id="city"
//                   type="text"
//                   name="city"
//                   value={input.city}
//                   onChange={changeEventHandler}
//                   required
//                   className="rounded-lg focus:ring-2 focus:ring-orange/20 border-gray-300 dark:border-gray-600"
//                   placeholder="Your city"
//                 />
//               </div>

//               <div className="md:col-span-2 space-y-2">
//                 <Label
//                   htmlFor="address"
//                   className="text-sm font-medium flex items-center gap-2"
//                 >
//                   <Home className="w-4 h-4 text-orange" />
//                   Delivery Address *
//                 </Label>
//                 <Input
//                   id="address"
//                   type="text"
//                   name="address"
//                   value={input.address}
//                   onChange={changeEventHandler}
//                   required
//                   className="rounded-lg focus:ring-2 focus:ring-orange/20 border-gray-300 dark:border-gray-600"
//                   placeholder="Full delivery address"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label
//                   htmlFor="country"
//                   className="text-sm font-medium flex items-center gap-2"
//                 >
//                   <Globe className="w-4 h-4 text-orange" />
//                   Country *
//                 </Label>
//                 <Input
//                   id="country"
//                   type="text"
//                   name="country"
//                   value={input.country}
//                   onChange={changeEventHandler}
//                   required
//                   className="rounded-lg focus:ring-2 focus:ring-orange/20 border-gray-300 dark:border-gray-600"
//                   placeholder="Your country"
//                 />
//               </div>
//             </div>

//             {/* Debug info - remove in production */}
//             <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
//               <div className="text-xs text-yellow-800 dark:text-yellow-200 space-y-1">
//                 <div className="font-semibold">Debug Information:</div>
//                 <div>
//                   Restaurant ID:{" "}
//                   <span className="font-mono">
//                     {currentRestaurantId || "Not available"}
//                   </span>
//                 </div>
//                 <div>Cart items: {cart.length}</div>
//                 <div>Total Amount: ₹{totalAmount}</div>

//                 {/* Temporary debug button */}
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => {
//                     debugRestaurantIds();
//                     toast.info(
//                       `Restaurant ID: ${currentRestaurantId || "Not found"}`
//                     );
//                   }}
//                   className="mt-2 text-xs h-6"
//                 >
//                   Debug Restaurant ID
//                 </Button>
//               </div>
//             </div>

//             <DialogFooter className="pt-6">
//               {loading ? (
//                 <Button
//                   disabled
//                   className="w-full bg-orange hover:bg-hoverOrange py-3 rounded-xl font-semibold shadow-lg transition-all duration-200"
//                 >
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Processing Your Order...
//                 </Button>
//               ) : (
//                 <Button
//                   type="submit"
//                   disabled={!currentRestaurantId || cart.length === 0}
//                   className="w-full bg-orange hover:bg-hoverOrange py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <MapPin className="mr-2 h-4 w-4" />
//                   Continue To Payment - ₹{grandTotal}
//                 </Button>
//               )}
//             </DialogFooter>
//           </form>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CheckoutConfirmPage;

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
    // 1. Use the passed restaurantId prop (highest priority)
    if (restaurantId) return restaurantId;

    // 2. Use singleRestaurant (from restaurant detail page)
    if (singleRestaurant?._id) return singleRestaurant._id;

    // 3. Use restaurant (user's restaurant)
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

    // Validate restaurant ID
    if (!currentRestaurantId) {
      toast.error(
        "Restaurant information is missing. Please try adding items to cart again."
      );
      return;
    }

    // Validate form data
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

    // API implementation
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
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange/10 rounded-xl">
              <MapPin className="w-6 h-6 text-orange" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Delivery Details
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Confirm your delivery information and proceed to payment
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange rounded-full"></span>
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
                      className="bg-orange/10 text-orange"
                    >
                      {item.quantity}
                    </Badge>
                    <span className="text-gray-700 dark:text-gray-300 line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Items ({totalItems})
                </span>
                <span className="font-medium">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Delivery Fee
                </span>
                <span className="font-medium">₹{deliveryFee}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900 dark:text-white">
                  Total Amount
                </span>
                <span className="text-orange">₹{grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Delivery Form */}
          <form onSubmit={checkoutHandler} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-orange" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  required
                  className="rounded-lg focus:ring-2 focus:ring-orange/20 border-gray-300 dark:border-gray-600"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-orange" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  disabled
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="contact"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-orange" />
                  Contact Number *
                </Label>
                <Input
                  id="contact"
                  type="text"
                  name="contact"
                  value={input.contact}
                  onChange={changeEventHandler}
                  required
                  className="rounded-lg focus:ring-2 focus:ring-orange/20 border-gray-300 dark:border-gray-600"
                  placeholder="Your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="city"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-orange" />
                  City *
                </Label>
                <Input
                  id="city"
                  type="text"
                  name="city"
                  value={input.city}
                  onChange={changeEventHandler}
                  required
                  className="rounded-lg focus:ring-2 focus:ring-orange/20 border-gray-300 dark:border-gray-600"
                  placeholder="Your city"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Home className="w-4 h-4 text-orange" />
                  Delivery Address *
                </Label>
                <Input
                  id="address"
                  type="text"
                  name="address"
                  value={input.address}
                  onChange={changeEventHandler}
                  required
                  className="rounded-lg focus:ring-2 focus:ring-orange/20 border-gray-300 dark:border-gray-600"
                  placeholder="Full delivery address"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Globe className="w-4 h-4 text-orange" />
                  Country *
                </Label>
                <Input
                  id="country"
                  type="text"
                  name="country"
                  value={input.country}
                  onChange={changeEventHandler}
                  required
                  className="rounded-lg focus:ring-2 focus:ring-orange/20 border-gray-300 dark:border-gray-600"
                  placeholder="Your country"
                />
              </div>
            </div>

            <DialogFooter className="pt-6">
              {loading ? (
                <Button
                  disabled
                  className="w-full bg-orange hover:bg-hoverOrange py-3 rounded-xl font-semibold shadow-lg transition-all duration-200"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Your Order...
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!currentRestaurantId || cart.length === 0}
                  className="w-full bg-orange hover:bg-hoverOrange py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
