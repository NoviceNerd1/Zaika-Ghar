import { Link, useParams, useNavigate } from "react-router-dom";
import FilterPage from "./FilterPage";
import { Input } from "./ui/input";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Globe,
  MapPin,
  X,
  Search,
  Clock,
  ChefHat,
  Star,
  Users,
  Filter,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { type Restaurant } from "@/types/restaurantType";
import { useDebounce } from "@/hooks/useDebounce";

const SearchPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const searchText = params.text || "";
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    loading,
    searchedRestaurant,
    searchRestaurant,
    setAppliedFilter,
    appliedFilter,
    resetAppliedFilter,
  } = useRestaurantStore();

  // // Simple debounce implementation
  // const useDebounce = <T,>(value: T, delay: number): T => {
  //   const [debouncedValue, setDebouncedValue] = useState<T>(value);

  //   useEffect(() => {
  //     const handler = setTimeout(() => {
  //       setDebouncedValue(value);
  //     }, delay);

  //     return () => {
  //       clearTimeout(handler);
  //     };
  //   }, [value, delay]);

  //   return debouncedValue;
  // };

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Load restaurants based on current state
  const loadRestaurants = useCallback(async () => {
    if (!searchText && !debouncedSearchQuery && appliedFilter.length === 0) {
      // Show all restaurants when no filters or search
      await searchRestaurant("", "", []);
    } else {
      // Perform search with current parameters
      await searchRestaurant(searchText, debouncedSearchQuery, appliedFilter);
    }
  }, [searchText, debouncedSearchQuery, appliedFilter, searchRestaurant]);

  // Load restaurants when component mounts or parameters change
  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  // Handle search submission
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      // Navigate to search results page
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
    } else {
      // Clear search and show all restaurants
      setSearchQuery("");
      loadRestaurants();
    }
  }, [searchQuery, navigate, loadRestaurants]);

  // Handle real-time search when typing (with debounce)
  useEffect(() => {
    if (debouncedSearchQuery && !searchText) {
      // Perform search without navigation for real-time results
      searchRestaurant("", debouncedSearchQuery, appliedFilter);
    }
  }, [debouncedSearchQuery, searchText, appliedFilter, searchRestaurant]);

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Clear all filters and search
  const handleClearAll = () => {
    setSearchQuery("");
    resetAppliedFilter();
    if (searchText) {
      navigate("/search");
    } else {
      loadRestaurants();
    }
  };

  // Remove individual filter
  const handleRemoveFilter = (filter: string) => {
    setAppliedFilter(filter);
    loadRestaurants();
  };

  // Toggle filter sidebar on mobile
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const resultsCount = searchedRestaurant?.data?.length || 0;
  const hasResults = resultsCount > 0;
  const hasActiveSearch = searchText || searchQuery || appliedFilter.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Hidden on mobile by default */}
          <div
            className={`lg:w-80 ${isFilterOpen ? "block" : "hidden lg:block"}`}
          >
            <FilterPage />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Header */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 mb-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-orange/10 rounded-xl">
                    <ChefHat className="w-6 h-6 text-orange" />
                  </div>
                  <div className="flex-1">
                    {/* <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      {searchText
                        ? `Search: "${searchText}"`
                        : "Discover Restaurants"}
                    </h1> */}
                    <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm lg:text-base">
                      {searchText
                        ? "Find the perfect match for your cravings"
                        : "Explore all amazing restaurants near you"}
                    </p>
                  </div>
                </div>

                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  onClick={toggleFilter}
                  className="lg:hidden flex items-center gap-2"
                  size="sm"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </div>

              {/* Search Input Field */}
              <div className="flex flex-col sm:flex-row items-center gap-4 max-w-4xl">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    value={searchQuery}
                    placeholder="Search by restaurant name, cuisines, location..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-orange/50 bg-white dark:bg-gray-700 shadow-sm transition-all duration-300"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <Button
                  onClick={handleSearch}
                  className="bg-orange hover:bg-hoverOrange py-4 px-6 lg:px-8 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 min-w-[120px]"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>

              {/* Quick Stats */}
              {searchedRestaurant?.data && (
                <div className="flex flex-wrap items-center gap-4 lg:gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {resultsCount} restaurant{resultsCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {appliedFilter.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Filter className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {appliedFilter.length} active filter
                        {appliedFilter.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  {loading && (
                    <div className="flex items-center gap-2 text-orange">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span className="text-sm font-medium">Searching...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    {searchText
                      ? "Search Results"
                      : hasActiveSearch
                      ? "Filtered Restaurants"
                      : "All Restaurants"}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="text-sm lg:text-base px-3 lg:px-4 py-1 lg:py-2 rounded-full"
                  >
                    {resultsCount} found
                  </Badge>
                </div>

                {/* Active Filters & Clear Button */}
                <div className="flex items-center gap-3">
                  {appliedFilter.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {appliedFilter.map(
                        (selectedFilter: string, idx: number) => (
                          <div
                            key={idx}
                            className="relative inline-flex items-center group"
                          >
                            <Badge
                              className="bg-orange/10 text-orange border-orange/20 hover:bg-orange/20 transition-all duration-200 rounded-full pl-3 pr-7 py-1 text-sm font-medium shadow-sm group-hover:scale-105"
                              variant="outline"
                            >
                              {selectedFilter}
                            </Badge>
                            <X
                              onClick={() => handleRemoveFilter(selectedFilter)}
                              size={14}
                              className="absolute right-2 text-orange hover:text-hoverOrange cursor-pointer transition-colors duration-200 group-hover:scale-110"
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {hasActiveSearch && (
                    <Button
                      variant="outline"
                      onClick={handleClearAll}
                      className="text-gray-500 hover:text-gray-700 border-gray-300 rounded-xl text-sm"
                      size="sm"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>

              {/* Restaurant Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {loading ? (
                  <SearchPageSkeleton />
                ) : !hasResults ? (
                  <NoResultFound
                    searchText={searchText}
                    searchQuery={searchQuery}
                    onClearSearch={handleClearAll}
                  />
                ) : (
                  searchedRestaurant?.data?.map((restaurant: Restaurant) => (
                    <RestaurantCard
                      key={restaurant._id}
                      restaurant={restaurant}
                    />
                  ))
                )}
              </div>

              {/* Load More Button (if needed) */}
              {hasResults && resultsCount >= 9 && (
                <div className="flex justify-center pt-8">
                  <Button
                    variant="outline"
                    className="rounded-2xl px-8 py-3 text-base"
                    onClick={loadRestaurants}
                  >
                    Load More Restaurants
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

// Enhanced Restaurant Card Component
const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 hover:translate-y-[-8px]">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          {!imageLoaded && !imageError && (
            <Skeleton className="w-full h-full rounded-none" />
          )}
          <img
            src={
              imageError ? "/restaurant-placeholder.jpg" : restaurant.imageUrl
            }
            alt={restaurant.restaurantName}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </AspectRatio>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge className="bg-white/95 dark:bg-gray-800/95 text-gray-700 dark:text-gray-300 font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border-0">
            <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
            Featured
          </Badge>
        </div>

        {/* Delivery Time */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/80 text-white px-3 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
          <Clock size={14} />
          <span>{restaurant.deliveryTime} min</span>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-orange transition-colors duration-300">
          {restaurant.restaurantName}
        </h3>

        {/* Location Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <MapPin size={18} className="text-orange flex-shrink-0" />
            <span className="text-sm leading-relaxed">
              {restaurant.city}, {restaurant.country}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Globe size={18} className="text-orange flex-shrink-0" />
            <span className="text-sm">
              {restaurant.cuisines.length} cuisine
              {restaurant.cuisines.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Cuisine Tags */}
        <div className="flex flex-wrap gap-2">
          {restaurant.cuisines
            .slice(0, 3)
            .map((cuisine: string, idx: number) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-orange/10 text-orange border-orange/20 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 group-hover:bg-orange/20"
              >
                {cuisine}
              </Badge>
            ))}
          {restaurant.cuisines.length > 3 && (
            <Badge
              variant="outline"
              className="text-gray-500 border-gray-300 px-3 py-1.5 rounded-full text-xs"
            >
              +{restaurant.cuisines.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-6 pt-0">
        <Link to={`/restaurant/${restaurant._id}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-orange to-hoverOrange hover:from-hoverOrange hover:to-orange text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 text-base">
            View Menu & Order
            <ChefHat className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

// Enhanced Skeleton Loader
const SearchPageSkeleton = () => {
  return (
    <>
      {[...Array(6)].map((_, index) => (
        <Card
          key={index}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="relative">
            <AspectRatio ratio={16 / 9}>
              <Skeleton className="w-full h-full rounded-none" />
            </AspectRatio>
          </div>
          <CardContent className="p-6">
            <Skeleton className="h-7 w-3/4 mb-3 rounded-lg" />
            <div className="space-y-3 mb-4">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Skeleton className="h-12 w-full rounded-2xl" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

// Enhanced No Results Component
const NoResultFound = ({
  searchText,
  searchQuery,
  onClearSearch,
}: {
  searchText: string;
  searchQuery: string;
  onClearSearch: () => void;
}) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 lg:py-20 px-4 text-center">
      <div className="w-24 h-24 lg:w-32 lg:h-32 bg-orange/10 rounded-full flex items-center justify-center mb-6 lg:mb-8">
        <Search className="w-12 h-12 lg:w-16 lg:h-16 text-orange" />
      </div>
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
        No restaurants found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg mb-4 max-w-md">
        {searchText || searchQuery ? (
          <>
            We couldn't find any results for{" "}
            <span className="font-semibold text-orange">
              "{searchText || searchQuery}"
            </span>
          </>
        ) : (
          "No restaurants are currently available. Please check back later."
        )}
      </p>
      <p className="text-gray-500 dark:text-gray-500 text-sm mb-8 max-w-lg">
        Try adjusting your search terms, check your filters, or explore all
        available restaurants.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={onClearSearch}
          className="bg-orange hover:bg-hoverOrange px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-base"
        >
          Explore All Restaurants
        </Button>
        <Button
          variant="outline"
          className="px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-semibold border-2 text-base"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </div>
    </div>
  );
};
