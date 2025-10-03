import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type RestaurantFromSchema,
  restaurantFromSchema,
} from "@/schema/restaurantSchema";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import {
  Loader2,
  Utensils,
  MapPin,
  Globe,
  Clock,
  ChefHat,
  Image,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

const Restaurant = () => {
  const [input, setInput] = useState<RestaurantFromSchema>({
    restaurantName: "",
    city: "",
    country: "",
    deliveryTime: 0,
    cuisines: [],
    imageFile: undefined,
  });
  const [errors, setErrors] = useState<Partial<RestaurantFromSchema>>({});
  const {
    loading,
    restaurant,
    updateRestaurant,
    createRestaurant,
    getRestaurant,
  } = useRestaurantStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = restaurantFromSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors as Partial<RestaurantFromSchema>);
      return;
    }
    // add restaurant api implementation start from here
    try {
      const formData = new FormData();
      formData.append("restaurantName", input.restaurantName);
      formData.append("city", input.city);
      formData.append("country", input.country);
      formData.append("deliveryTime", input.deliveryTime.toString());
      formData.append("cuisines", JSON.stringify(input.cuisines));

      if (input.imageFile) {
        formData.append("imageFile", input.imageFile);
      }

      if (restaurant) {
        // update
        await updateRestaurant(formData);
      } else {
        // create
        await createRestaurant(formData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      await getRestaurant();
      if (restaurant) {
        setInput({
          restaurantName: restaurant.restaurantName || "",
          city: restaurant.city || "",
          country: restaurant.country || "",
          deliveryTime: restaurant.deliveryTime || 0,
          cuisines: restaurant.cuisines
            ? restaurant.cuisines.map((cuisine: string) => cuisine)
            : [],
          imageFile: undefined,
        });
      }
    };
    fetchRestaurant();
  }, [getRestaurant]);

  return (
    <div className="max-w-4xl mx-auto my-8 p-6">
      <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/20 rounded-lg">
              <Utensils className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-tight">
                {restaurant ? "Update Your Restaurant" : "Add New Restaurant"}
              </h1>
              <p className="text-primary-foreground/80 text-sm mt-1">
                {restaurant
                  ? "Make changes to your restaurant details"
                  : "Complete the form below to list your restaurant"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Restaurant Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="restaurantName"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Utensils className="h-4 w-4" />
                  Restaurant Name
                </Label>
                <Input
                  id="restaurantName"
                  type="text"
                  name="restaurantName"
                  value={input.restaurantName}
                  onChange={changeEventHandler}
                  placeholder="Enter your restaurant name"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                {errors.restaurantName && (
                  <span className="text-xs text-destructive font-medium flex items-center gap-1">
                    {errors.restaurantName}
                  </span>
                )}
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label
                  htmlFor="city"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  City
                </Label>
                <Input
                  id="city"
                  type="text"
                  name="city"
                  value={input.city}
                  onChange={changeEventHandler}
                  placeholder="Enter your city name"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                {errors.city && (
                  <span className="text-xs text-destructive font-medium flex items-center gap-1">
                    {errors.city}
                  </span>
                )}
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Country
                </Label>
                <Input
                  id="country"
                  type="text"
                  name="country"
                  value={input.country}
                  onChange={changeEventHandler}
                  placeholder="Enter your country name"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                {errors.country && (
                  <span className="text-xs text-destructive font-medium flex items-center gap-1">
                    {errors.country}
                  </span>
                )}
              </div>

              {/* Delivery Time */}
              <div className="space-y-2">
                <Label
                  htmlFor="deliveryTime"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Delivery Time (minutes)
                </Label>
                <Input
                  id="deliveryTime"
                  type="number"
                  name="deliveryTime"
                  value={input.deliveryTime}
                  onChange={changeEventHandler}
                  placeholder="Enter delivery time in minutes"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  min="0"
                />
                {errors.deliveryTime && (
                  <span className="text-xs text-destructive font-medium flex items-center gap-1">
                    {errors.deliveryTime}
                  </span>
                )}
              </div>

              {/* Cuisines */}
              <div className="space-y-2">
                <Label
                  htmlFor="cuisines"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <ChefHat className="h-4 w-4" />
                  Cuisines
                </Label>
                <Input
                  id="cuisines"
                  type="text"
                  name="cuisines"
                  value={input.cuisines}
                  onChange={(e) =>
                    setInput({ ...input, cuisines: e.target.value.split(",") })
                  }
                  placeholder="e.g. Italian, Chinese, Mexican (comma separated)"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                {errors.cuisines && (
                  <span className="text-xs text-destructive font-medium flex items-center gap-1">
                    {errors.cuisines}
                  </span>
                )}
                <p className="text-xs text-muted-foreground">
                  Separate multiple cuisines with commas
                </p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label
                  htmlFor="imageFile"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Image className="h-4 w-4" />
                  Restaurant Banner
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 transition-all duration-200 hover:border-primary/50 hover:bg-accent/50">
                  <Input
                    id="imageFile"
                    onChange={(e) =>
                      setInput({
                        ...input,
                        imageFile: e.target.files?.[0] || undefined,
                      })
                    }
                    type="file"
                    accept="image/*"
                    name="imageFile"
                    className="cursor-pointer file:cursor-pointer file:bg-primary file:text-primary-foreground file:px-3 file:py-2 file:rounded-md file:border-0"
                  />
                </div>
                {errors.imageFile && (
                  <span className="text-xs text-destructive font-medium flex items-center gap-1">
                    {errors.imageFile?.name}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-border">
              {loading ? (
                <Button
                  disabled
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 px-8 py-2.5 text-base font-medium rounded-lg transition-all duration-200"
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {restaurant
                    ? "Updating Restaurant..."
                    : "Creating Restaurant..."}
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 px-8 py-2.5 text-base font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {restaurant ? "Update Restaurant" : "Add Restaurant"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
