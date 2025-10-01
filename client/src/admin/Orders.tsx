import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useEffect } from "react";
import {
  Package,
  MapPin,
  DollarSign,
  Clock,
  User,
  Truck,
  CheckCircle,
  ChefHat,
} from "lucide-react";
import { type Orders as OrderType } from "@/types/orderType";

const Orders = () => {
  const { restaurantOrder, getRestaurantOrders, updateRestaurantOrder } =
    useRestaurantStore();

  const handleStatusChange = async (id: string, status: string) => {
    await updateRestaurantOrder(id, status);
  };

  useEffect(() => {
    getRestaurantOrders();
  }, [getRestaurantOrders]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
      confirmed:
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
      preparing:
        "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
      outfordelivery:
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
      delivered:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      confirmed: ChefHat,
      preparing: ChefHat,
      outfordelivery: Truck,
      delivered: CheckCircle,
    };
    return icons[status as keyof typeof icons] || Package;
  };

  // Get order items safely - use cartItems from the OrderType
  const getOrderItems = (order: OrderType) => {
    return order.cartItems || [];
  };

  // Format status for display
  const formatStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      pending: "Pending",
      confirmed: "Confirmed",
      preparing: "Preparing",
      outfordelivery: "Out for Delivery",
      delivered: "Delivered",
    };
    return statusMap[status] || status;
  };

  // Cast the orders to use the proper OrderType
  const orders = restaurantOrder as OrderType[];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Orders Overview
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Manage and track all restaurant orders in one place
        </p>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {orders.filter((order) => order.status === "pending").length}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Preparing</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {
                orders.filter(
                  (order) =>
                    order.status === "preparing" || order.status === "confirmed"
                ).length
              }
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Delivery</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {
                orders.filter((order) => order.status === "outfordelivery")
                  .length
              }
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {orders.filter((order) => order.status === "delivered").length}
            </p>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border shadow-sm">
            <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Orders Yet
            </h3>
            <p className="text-muted-foreground">
              Orders will appear here once customers start placing them.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            const orderItems = getOrderItems(order);

            return (
              <div
                key={order._id}
                className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden transition-all duration-200 hover:shadow-xl"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    {/* Order Details */}
                    <div className="flex-1 space-y-4">
                      {/* Customer & Status Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-foreground">
                              {order.deliveryDetails.name}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {formatStatus(order.status)}
                        </div>
                      </div>

                      {/* Order Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 text-foreground">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              Delivery Address
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.deliveryDetails.address}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-foreground">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Total Amount</p>
                            <p className="text-lg font-semibold text-primary">
                              ${(order.totalAmount / 100).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-foreground">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Contact</p>
                            <p className="text-sm text-muted-foreground">
                              {order.deliveryDetails.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.deliveryDetails.contact}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items Preview - Only show if items exist */}
                      {orderItems.length > 0 && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm font-medium text-foreground mb-2">
                            Order Items ({orderItems.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {orderItems
                              .slice(0, 4)
                              .map((item, index: number) => (
                                <span
                                  key={item.menuId || index}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium border border-border"
                                >
                                  <span className="text-primary font-bold">
                                    {item.quantity}x
                                  </span>
                                  <span className="max-w-[120px] truncate">
                                    {item.name}
                                  </span>
                                  <span className="text-muted-foreground text-xs">
                                    ($
                                    {(
                                      (item.price * item.quantity) /
                                      100
                                    ).toFixed(2)}
                                    )
                                  </span>
                                </span>
                              ))}
                            {orderItems.length > 4 && (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium border border-border">
                                +{orderItems.length - 4} more items
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Selector */}
                    <div className="w-full lg:w-64 shrink-0">
                      <Label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Update Status
                      </Label>
                      <Select
                        onValueChange={(newStatus) =>
                          handleStatusChange(order._id, newStatus)
                        }
                        defaultValue={order.status}
                      >
                        <SelectTrigger className="w-full bg-background border-input hover:bg-accent/50 transition-colors duration-200">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border shadow-lg">
                          <SelectGroup>
                            {[
                              "pending",
                              "confirmed",
                              "preparing",
                              "outfordelivery",
                              "delivered",
                            ].map((status: string, index: number) => {
                              const StatusIcon = getStatusIcon(status);
                              return (
                                <SelectItem
                                  key={index}
                                  value={status}
                                  className="flex items-center gap-2 focus:bg-accent focus:text-accent-foreground transition-colors duration-150"
                                >
                                  <StatusIcon className="h-4 w-4" />
                                  {formatStatus(status)}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
