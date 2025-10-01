import { useRestaurantStore } from "@/store/useRestaurantStore";
import AvailableMenu from "./AvailableMenu";
import { Badge } from "./ui/badge";
import { Timer, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RestaurantDetail = () => {
  const params = useParams();
  const { singleRestaurant, getSingleRestaurant, loading } =
    useRestaurantStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!params.id) {
        setError("Restaurant ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        await getSingleRestaurant(params.id);
      } catch (err) {
        console.error("Failed to fetch restaurant:", err);
        setError("Failed to load restaurant details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, [params.id, getSingleRestaurant]);

  // Loading state
  if (isLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto my-10 flex justify-center items-center min-h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange" />
          <p className="text-gray-600">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !singleRestaurant) {
    return (
      <div className="max-w-6xl mx-auto my-10 flex justify-center items-center min-h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error || "Restaurant not found"}
          </h2>
          <p className="text-gray-600">
            Please try refreshing the page or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="w-full">
        {/* Restaurant Image */}
        <div className="relative w-full h-32 md:h-64 lg:h-72">
          <img
            src={singleRestaurant.imageUrl}
            alt={singleRestaurant.restaurantName}
            className="object-cover w-full h-full rounded-lg shadow-lg"
            onError={(e) => {
              // Fallback for broken images
              (e.target as HTMLImageElement).src =
                "/restaurant-placeholder.jpg";
            }}
          />
        </div>

        {/* Restaurant Details */}
        <div className="flex flex-col md:flex-row justify-between">
          <div className="my-5">
            <h1 className="font-medium text-xl md:text-2xl text-gray-800">
              {singleRestaurant.restaurantName}
            </h1>

            {/* Cuisines */}
            <div className="flex flex-wrap gap-2 my-2">
              {singleRestaurant.cuisines.map((cuisine: string, idx: number) => (
                <Badge key={`${cuisine}-${idx}`} variant="secondary">
                  {cuisine}
                </Badge>
              ))}
            </div>

            {/* Delivery Info */}
            <div className="flex md:flex-row flex-col gap-4 my-5">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-gray-600" />
                <h1 className="flex items-center gap-2 font-medium text-gray-700">
                  Delivery Time:{" "}
                  <span className="text-orange font-semibold">
                    {singleRestaurant.deliveryTime} mins
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Available Menu */}
        {singleRestaurant.menus && singleRestaurant.menus.length > 0 ? (
          <AvailableMenu menus={singleRestaurant.menus} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No menu items available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
