import { IndianRupee, CheckCircle, Clock, Package, Home } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter } from "./ui/card";

// Define the actual order item type based on your API response
type OrderItem = {
  menuId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  status: string;
  totalAmount?: number;
  cartItems: OrderItem[];
};

const Success = () => {
  const { orders, getOrderDetails, loading } = useOrderStore();

  useEffect(() => {
    getOrderDetails();
  }, [getOrderDetails]);

  // Get the latest order with proper typing
  const latestOrder =
    orders.length > 0 ? (orders[orders.length - 1] as Order) : null;

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20 dark:from-gray-900 dark:to-gray-800 px-4">
        <Card className="max-w-md w-full text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              Loading Orders...
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we fetch your order details.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!latestOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20 dark:from-gray-900 dark:to-gray-800 px-4">
        <Card className="max-w-md w-full text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              No Orders Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
            <Link to="/" className="block">
              <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                <Home className="mr-2 w-5 h-5" />
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orderStatus = latestOrder.status || "confirmed";

  // Calculate total amount safely
  const totalAmount =
    latestOrder.totalAmount ||
    latestOrder.cartItems?.reduce(
      (total: number, item: OrderItem) => total + item.price * item.quantity,
      0
    ) ||
    0;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500";
      case "preparing":
        return "bg-blue-500";
      case "out for delivery":
        return "bg-orange";
      case "delivered":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5" />;
      case "preparing":
      case "out for delivery":
        return <Clock className="w-5 h-5" />;
      case "delivered":
        return <Package className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Order Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Thank you for your order. We're preparing it for you.
          </p>
        </div>

        {/* Order Status Card */}
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-6 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Order Status
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Order #{latestOrder._id?.slice(-8) || "N/A"}
                </p>
              </div>
              <Badge
                className={`${getStatusColor(
                  orderStatus
                )} text-white px-3 py-1 rounded-full flex items-center gap-1`}
              >
                {getStatusIcon(orderStatus)}
                {orderStatus.toUpperCase()}
              </Badge>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Confirmed</span>
              <span>Preparing</span>
              <span>On the way</span>
              <span>Delivered</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
              <div
                className={`${getStatusColor(
                  orderStatus
                )} h-2 rounded-full transition-all duration-500`}
                style={{
                  width:
                    orderStatus.toLowerCase() === "confirmed"
                      ? "25%"
                      : orderStatus.toLowerCase() === "preparing"
                      ? "50%"
                      : orderStatus.toLowerCase() === "out for delivery"
                      ? "75%"
                      : "100%",
                }}
              ></div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-orange" />
                Order Summary
              </h3>

              <div className="space-y-4">
                {latestOrder.cartItems?.map(
                  (item: OrderItem, index: number) => (
                    <div
                      key={`${item.menuId}-${index}`}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow duration-200"
                          />
                          <Badge className="absolute -top-1 -right-1 bg-orange text-white text-xs">
                            {item.quantity}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end text-gray-900 dark:text-white font-semibold">
                          <IndianRupee className="w-4 h-4" />
                          <span className="text-lg">
                            {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              <Separator className="my-6" />

              {/* Total Amount */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Amount
                </span>
                <div className="flex items-center text-2xl font-bold text-orange">
                  <IndianRupee className="w-6 h-6" />
                  <span>{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 dark:bg-gray-700/50 p-6">
            <div className="w-full space-y-3">
              <Link to="/" className="block">
                <Button className="w-full bg-orange hover:bg-hoverOrange py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                  <Home className="mr-2 w-5 h-5" />
                  Continue Shopping
                </Button>
              </Link>
              <Link to="/profile" className="block">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 dark:border-gray-600 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  View Order History
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Additional Info */}
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange" />
              What's Next?
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• You'll receive an order confirmation email shortly</p>
              <p>• We'll notify you when your order is out for delivery</p>
              <p>• Estimated delivery time: 30-45 minutes</p>
              <p>• For any questions, contact our support team</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Success;
