import { Minus, Plus, Trash2 } from "lucide-react";
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
    restaurantId,
    clearCart,
    removeFromTheCart,
  } = useCartStore();

  const totalAmount = cart.reduce((acc, ele) => {
    return acc + ele.price * ele.quantity;
  }, 0);

  const handleClearCart = () => {
    clearCart();
  };

  const handleRemoveItem = (id: string) => {
    removeFromTheCart(id);
  };

  return (
    <div className="flex flex-col max-w-7xl mx-auto my-10 px-4">
      <div className="flex justify-end mb-6">
        <Button
          variant="outline"
          onClick={handleClearCart}
          disabled={cart.length === 0}
          className="border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-accent rounded-2xl border border-border">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-primary/60" />
            </div>
            <p className="text-xl font-medium text-muted-foreground">
              Your cart is empty
            </p>
            <p className="text-sm text-muted-foreground">
              Add some delicious items to get started!
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-accent">
                <TableRow className="border-border hover:bg-accent">
                  <TableHead className="text-muted-foreground font-semibold">
                    Items
                  </TableHead>
                  <TableHead className="text-muted-foreground font-semibold">
                    Title
                  </TableHead>
                  <TableHead className="text-muted-foreground font-semibold">
                    Price
                  </TableHead>
                  <TableHead className="text-muted-foreground font-semibold">
                    Quantity
                  </TableHead>
                  <TableHead className="text-muted-foreground font-semibold">
                    Total
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground font-semibold">
                    Remove
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item: CartItem) => (
                  <TableRow
                    key={item._id}
                    className="border-border hover:bg-accent/50 transition-colors"
                  >
                    <TableCell>
                      <Avatar className="border-2 border-border">
                        <AvatarImage src={item.image} alt={item.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {item.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-card-foreground">
                      {" "}
                      {item.name}
                    </TableCell>
                    <TableCell className="text-card-foreground">
                      {" "}
                      ₹{item.price}
                    </TableCell>
                    <TableCell>
                      <div className="w-fit flex items-center rounded-full border border-border shadow-sm">
                        <Button
                          onClick={() => decrementQuantity(item._id)}
                          size={"icon"}
                          variant={"outline"}
                          className="rounded-full bg-accent hover:bg-accent/80 border-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button
                          size={"icon"}
                          className="font-bold border-0 bg-transparent hover:bg-transparent text-card-foreground"
                          disabled
                          variant={"outline"}
                        >
                          {item.quantity}
                        </Button>
                        <Button
                          onClick={() => incrementQuantity(item._id)}
                          size={"icon"}
                          className="rounded-full bg-primary hover:bg-primary/90 border-0"
                          variant={"outline"}
                        >
                          <Plus className="w-4 h-4 text-primary-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-card-foreground">
                      ₹{item.price * item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size={"sm"}
                        variant="outline"
                        className="border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-accent">
                <TableRow className="border-border hover:bg-accent">
                  <TableCell
                    colSpan={5}
                    className="text-lg font-bold text-card-foreground"
                  >
                    Total Amount
                  </TableCell>
                  <TableCell className="text-right text-lg font-bold text-primary">
                    ₹{totalAmount}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <div className="flex justify-end my-8">
            <Button
              onClick={() => setOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              size="lg"
            >
              Proceed To Checkout - ₹{totalAmount}
            </Button>
          </div>
        </>
      )}

      <CheckoutConfirmPage
        open={open}
        setOpen={setOpen}
        restaurantId={restaurantId}
      />
    </div>
  );
};

export default Cart;
