import {
  Loader2,
  Mail,
  MapPin,
  Camera,
  User,
  Home,
  Globe,
  ShoppingBag,
  Calendar,
  Receipt,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { type FormEvent, useRef, useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { useOrderStore } from "@/store/useOrderStore";
import type { Orders } from "@/types/orderType";

const Profile = () => {
  const { user, updateProfile } = useUserStore();
  const { orders, loading, getOrderDetails } = useOrderStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [orderTimers, setOrderTimers] = useState<{ [key: string]: number }>({});

  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
    profilePicture: user?.profilePicture || "",
  });

  const imageRef = useRef<HTMLInputElement | null>(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(
    user?.profilePicture || ""
  );

  // Fetch orders when order history tab is active
  useEffect(() => {
    if (activeTab === "orders" && user) {
      getOrderDetails();
    }
  }, [activeTab, user, getOrderDetails]);

  // Initialize timers for orders
  useEffect(() => {
    if (orders && orders.length > 0) {
      const timers: { [key: string]: number } = {};
      orders.forEach((order) => {
        if (order.createdAt) {
          const orderTime = new Date(order.createdAt).getTime();
          const currentTime = new Date().getTime();
          const timeElapsed = Math.floor((currentTime - orderTime) / 1000); // seconds
          timers[order._id] = timeElapsed;
        }
      });
      setOrderTimers(timers);
    }
  }, [orders]);

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderTimers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((orderId) => {
          updated[orderId] = (updated[orderId] || 0) + 1;
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Please select an image smaller than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedProfilePicture(result);
        setProfileData((prevData) => ({
          ...prevData,
          profilePicture: result,
        }));
      };
      reader.onerror = () => {
        alert("Error reading file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const updateProfileHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateProfile(profileData);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return "Date not available";
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "out for delivery":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  // Custom tab component
  const TabButton = ({
    icon: Icon,
    label,
    isActive,
    onClick,
  }: {
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
        isActive
          ? "bg-white dark:bg-gray-700 shadow-sm text-orange"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      {/* Custom Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
          <div className="flex space-x-1">
            <TabButton
              value="profile"
              icon={User}
              label="Profile"
              isActive={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <TabButton
              value="orders"
              icon={ShoppingBag}
              label="Order History"
              isActive={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            />
          </div>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-8">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange to-hoverOrange bg-clip-text text-transparent">
                Profile Settings
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-6">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-2xl">
                    <AvatarImage
                      src={selectedProfilePicture || user?.profilePicture}
                      className="object-cover"
                      alt="Profile picture"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-orange to-hoverOrange text-white text-2xl font-bold">
                      {user?.fullname?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <input
                    ref={imageRef}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={fileChangeHandler}
                  />

                  <button
                    type="button"
                    onClick={() => imageRef.current?.click()}
                    className="absolute bottom-2 right-2 p-3 bg-orange hover:bg-hoverOrange text-white rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 opacity-90 hover:opacity-100"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center space-y-2">
                  <Input
                    type="text"
                    name="fullname"
                    value={profileData.fullname}
                    onChange={changeHandler}
                    className="text-3xl font-bold text-center border-none focus-visible:ring-2 focus-visible:ring-orange/20 bg-transparent px-0"
                    placeholder="Your Name"
                  />
                  <div className="flex items-center justify-center gap-4">
                    <Badge
                      variant={user?.isVerified ? "default" : "secondary"}
                      className={`${
                        user?.isVerified
                          ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {user?.isVerified ? "Verified" : "Not Verified"}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300"
                    >
                      {user?.admin ? "Admin" : "User"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700" />

              {/* Profile Information Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Mail className="w-4 h-4 text-orange" />
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      disabled
                      name="email"
                      value={profileData.email}
                      onChange={changeHandler}
                      className="pl-10 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 h-12 rounded-xl"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Contact */}
                {user?.contact && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <User className="w-4 h-4 text-orange" />
                      Contact Number
                    </Label>
                    <div className="relative">
                      <Input
                        disabled
                        value={user.contact.toString()}
                        className="pl-10 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 h-12 rounded-xl"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )}

                {/* Address */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Home className="w-4 h-4 text-orange" />
                    Address
                  </Label>
                  <div className="relative">
                    <Input
                      name="address"
                      value={profileData.address}
                      onChange={changeHandler}
                      className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 rounded-xl focus:ring-2 focus:ring-orange/20 transition-all duration-200"
                      placeholder="Enter your address"
                    />
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-orange" />
                    City
                  </Label>
                  <div className="relative">
                    <Input
                      name="city"
                      value={profileData.city}
                      onChange={changeHandler}
                      className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 rounded-xl focus:ring-2 focus:ring-orange/20 transition-all duration-200"
                      placeholder="Enter your city"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-3 lg:col-span-2">
                  <Label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Globe className="w-4 h-4 text-orange" />
                    Country
                  </Label>
                  <div className="relative">
                    <Input
                      name="country"
                      value={profileData.country}
                      onChange={changeHandler}
                      className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-12 rounded-xl focus:ring-2 focus:ring-orange/20 transition-all duration-200"
                      placeholder="Enter your country"
                    />
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 max-w-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 h-12 rounded-xl transition-all duration-200"
                  onClick={() => {
                    setProfileData({
                      fullname: user?.fullname || "",
                      email: user?.email || "",
                      address: user?.address || "",
                      city: user?.city || "",
                      country: user?.country || "",
                      profilePicture: user?.profilePicture || "",
                    });
                    setSelectedProfilePicture(user?.profilePicture || "");
                  }}
                >
                  Reset Changes
                </Button>

                {isLoading ? (
                  <Button
                    disabled
                    className="flex-1 max-w-xs bg-orange hover:bg-hoverOrange h-12 rounded-xl shadow-lg transition-all duration-200"
                  >
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Updating Profile...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      const formEvent =
                        e as unknown as FormEvent<HTMLFormElement>;
                      updateProfileHandler(formEvent);
                    }}
                    className="flex-1 max-w-xs bg-gradient-to-r from-orange to-hoverOrange hover:from-hoverOrange hover:to-orange text-white h-12 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Order History Tab */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange to-hoverOrange bg-clip-text text-transparent">
                Order History
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                View your past orders and their status
              </CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange" />
                  <p className="text-gray-600 dark:text-gray-400 mt-4">
                    Loading your orders...
                  </p>
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order: Orders) => (
                    <Card
                      key={order._id}
                      className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-4">
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                Order #{order._id?.slice(-8).toUpperCase()}
                              </h3>
                              <Badge
                                className={getOrderStatusColor(order.status)}
                              >
                                {order.status?.charAt(0).toUpperCase() +
                                  order.status?.slice(1)}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(order.createdAt)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Receipt className="w-4 h-4" />₹
                                {order.totalAmount}
                              </div>
                              <div className="flex items-center gap-1">
                                <ShoppingBag className="w-4 h-4" />
                                {order.cartItems?.length || 0} items
                              </div>
                              {order.status?.toLowerCase() ===
                                "out for delivery" && (
                                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                                  <Clock className="w-4 h-4" />
                                  {formatTime(orderTimers[order._id] || 0)}
                                </div>
                              )}
                            </div>

                            {/* Order Items Preview */}
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Items:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {order.cartItems &&
                                order.cartItems.length > 0 ? (
                                  <>
                                    {order.cartItems
                                      .slice(0, 3)
                                      .map((item, index: number) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {item.name || `Item ${index + 1}`} ×{" "}
                                          {item.quantity || 1}
                                        </Badge>
                                      ))}
                                    {order.cartItems.length > 3 && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        +{order.cartItems.length - 3} more
                                      </Badge>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    No items available
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Delivery Details */}
                            {order.deliveryDetails && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Delivery to:
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {order.deliveryDetails.name || "N/A"} •{" "}
                                  {order.deliveryDetails.address ||
                                    "Address not available"}
                                  ,{" "}
                                  {order.deliveryDetails.city ||
                                    "City not available"}
                                </p>
                              </div>
                            )}
                          </div>

                          <Button
                            variant="outline"
                            className="shrink-0 border-orange text-orange hover:bg-orange hover:text-white"
                            onClick={() => {
                              // Navigate to order details page or show modal
                              console.log("View order details:", order._id);
                            }}
                          >
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No orders yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You haven't placed any orders yet. Start shopping to see
                    your order history here.
                  </p>
                  <Button
                    className="bg-orange hover:bg-hoverOrange"
                    onClick={() => (window.location.href = "/")}
                  >
                    Start Shopping
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
