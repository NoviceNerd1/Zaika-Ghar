import { Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState } from "react";
import CheckoutConfirmPage from "./CheckoutConfirmPage";
import { useCartStore } from "@/store/useCartStore";
import { type CartItem } from "@/types/cartType";

const Cart = () => {
  const [open, setOpen] = useState<boolean>(false);
  const {
    cart,
    decrementQuantity,
    incrementQuantity,
    restaurantId, // Get restaurantId from cart store
    clearCart, // Add clear cart functionality
    removeFromTheCart, // Add remove item functionality
  } = useCartStore();

  let totalAmount = cart.reduce((acc, ele) => {
    return acc + ele.price * ele.quantity;
  }, 0);

  const handleClearCart = () => {
    clearCart();
  };

  const handleRemoveItem = (id: string) => {
    removeFromTheCart(id);
  };

  return (
    <div className="flex flex-col max-w-7xl mx-auto my-10">
      <div className="flex justify-end">
        <Button
          variant="link"
          onClick={handleClearCart}
          disabled={cart.length === 0}
        >
          Clear All
        </Button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Items</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item: CartItem) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={item.image} alt={item.name} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell> {item.name}</TableCell>
                  <TableCell> ₹{item.price}</TableCell>
                  <TableCell>
                    <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md">
                      <Button
                        onClick={() => decrementQuantity(item._id)}
                        size={"icon"}
                        variant={"outline"}
                        className="rounded-full bg-gray-200"
                      >
                        <Minus />
                      </Button>
                      <Button
                        size={"icon"}
                        className="font-bold border-none"
                        disabled
                        variant={"outline"}
                      >
                        {item.quantity}
                      </Button>
                      <Button
                        onClick={() => incrementQuantity(item._id)}
                        size={"icon"}
                        className="rounded-full bg-orange hover:bg-hoverOrange"
                        variant={"outline"}
                      >
                        <Plus />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>₹{item.price * item.quantity}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size={"sm"}
                      className="bg-orange hover:bg-hoverOrange"
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="text-2xl font-bold">
                <TableCell colSpan={5}>Total</TableCell>
                <TableCell className="text-right">₹{totalAmount}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <div className="flex justify-end my-5">
            <Button
              onClick={() => setOpen(true)}
              className="bg-orange hover:bg-hoverOrange"
            >
              Proceed To Checkout
            </Button>
          </div>
        </>
      )}

      {/* Pass restaurantId from cart store to CheckoutConfirmPage */}
      <CheckoutConfirmPage
        open={open}
        setOpen={setOpen}
        restaurantId={restaurantId} // This is the key fix
      />
    </div>
  );
};

export default Cart;
