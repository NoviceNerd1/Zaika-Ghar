import { useRestaurantStore } from "@/store/useRestaurantStore";
import AvailableMenu from "./AvailableMenu";
import { Badge } from "./ui/badge";
import { Timer, Loader2, Star, MapPin } from "lucide-react";
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
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !singleRestaurant) {
    return (
      <div className="max-w-6xl mx-auto my-10 flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <Timer className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {error || "Restaurant not found"}
          </h2>
          <p className="text-muted-foreground">
            Please try refreshing the page or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        {/* Restaurant Image with Overlay */}
        <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden shadow-lg group">
          <img
            src={singleRestaurant.imageUrl}
            alt={singleRestaurant.restaurantName}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/restaurant-placeholder.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />

          {/* Rating Badge */}
          {singleRestaurant.rating && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-md">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-foreground">
                  {singleRestaurant.rating}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Restaurant Details */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mt-6">
          <div className="flex-1 space-y-4">
            {/* Header Section */}
            <div className="space-y-3">
              <h1 className="font-bold text-2xl md:text-3xl text-foreground">
                {singleRestaurant.restaurantName}
              </h1>

              {/* Location */}
              {singleRestaurant.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{singleRestaurant.location}</span>
                </div>
              )}

              {/* Cuisines */}
              <div className="flex flex-wrap gap-2">
                {singleRestaurant.cuisines.map(
                  (cuisine: string, idx: number) => (
                    <Badge
                      key={`${cuisine}-${idx}`}
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      {cuisine}
                    </Badge>
                  )
                )}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Timer className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Time</p>
                  <p className="font-semibold text-foreground">
                    {singleRestaurant.deliveryTime} mins
                  </p>
                </div>
              </div>

              {/* Additional info can be added here */}
              {singleRestaurant.cost && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <span className="text-sm font-semibold text-secondary">
                      ₹
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Average Cost
                    </p>
                    <p className="font-semibold text-foreground">
                      ₹{singleRestaurant.cost} for two
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-border" />

        {/* Available Menu */}
        {singleRestaurant.menus && singleRestaurant.menus.length > 0 ? (
          <AvailableMenu menus={singleRestaurant.menus} />
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Timer className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Menu Unavailable
            </h3>
            <p className="text-muted-foreground">
              No menu items available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
