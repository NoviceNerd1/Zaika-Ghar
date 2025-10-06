import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Plus,
  Utensils,
  FileText,
  IndianRupee,
  Image,
  Edit,
  ChefHat,
  Sparkles,
} from "lucide-react";
import React, { type FormEvent, useState } from "react";
import EditMenu from "./EditMenu";
import { type MenuFromSchema, menuSchema } from "@/schema/menuSchema";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import type { MenuItem } from "@/types/restaurantType";

const AddMenu = () => {
  const [input, setInput] = useState<MenuFromSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<any>();
  const [error, setError] = useState<Partial<MenuFromSchema>>({});
  const { loading, createMenu } = useMenuStore();
  const { restaurant } = useRestaurantStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = menuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setError(fieldErrors as Partial<MenuFromSchema>);
      return;
    }
    // api ka kaam start from here
    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      if (input.image) {
        formData.append("image", input.image);
      }
      await createMenu(formData);
      setOpen(false);
      setInput({ name: "", description: "", price: 0, image: undefined });
      setError({});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 sm:px-6">
      {/* Enhanced Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <ChefHat className="h-8 w-8 text-primary relative z-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-card-foreground">
              Available Menus
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Craft your restaurant's culinary story with delicious menu items
            that will leave customers craving for more
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              Add New Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md md:max-w-lg bg-card border-border shadow-2xl rounded-2xl">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-bold text-card-foreground">
                    Add New Menu Item
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-base">
                    Create a menu that will make your restaurant stand out from
                    the crowd
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="grid gap-6">
                {/* Enhanced Name Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold flex items-center gap-2 text-card-foreground"
                  >
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <Utensils className="h-3.5 w-3.5 text-primary" />
                    </div>
                    Menu Item Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={changeEventHandler}
                    placeholder="e.g., Butter Chicken, Paneer Tikka Masala"
                    className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary border-border bg-background"
                  />
                  {error.name && (
                    <span className="text-xs font-medium text-destructive flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {error.name}
                    </span>
                  )}
                </div>

                {/* Enhanced Description Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="description"
                    className="text-sm font-semibold flex items-center gap-2 text-card-foreground"
                  >
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                    </div>
                    Description
                  </Label>
                  <Input
                    id="description"
                    type="text"
                    name="description"
                    value={input.description}
                    onChange={changeEventHandler}
                    placeholder="Describe the flavors, ingredients, and special features"
                    className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary border-border bg-background"
                  />
                  {error.description && (
                    <span className="text-xs font-medium text-destructive flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {error.description}
                    </span>
                  )}
                </div>

                {/* Enhanced Price Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="price"
                    className="text-sm font-semibold flex items-center gap-2 text-card-foreground"
                  >
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <IndianRupee className="h-3.5 w-3.5 text-primary" />
                    </div>
                    Price (₹)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    name="price"
                    value={input.price}
                    onChange={changeEventHandler}
                    placeholder="Enter price in rupees"
                    className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary border-border bg-background"
                    min="0"
                    step="0.01"
                  />
                  {error.price && (
                    <span className="text-xs font-medium text-destructive flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {error.price}
                    </span>
                  )}
                </div>

                {/* Enhanced Image Upload Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="image"
                    className="text-sm font-semibold flex items-center gap-2 text-card-foreground"
                  >
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <Image className="h-3.5 w-3.5 text-primary" />
                    </div>
                    Menu Image
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 transition-all duration-300 hover:border-primary/50 hover:bg-accent group cursor-pointer">
                    <Input
                      id="image"
                      type="file"
                      name="image"
                      onChange={(e) =>
                        setInput({
                          ...input,
                          image: e.target.files?.[0] || undefined,
                        })
                      }
                      accept="image/*"
                      className="cursor-pointer file:cursor-pointer file:bg-primary file:text-primary-foreground file:px-4 file:py-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Upload an appetizing photo that showcases your delicious
                    creation
                  </p>
                  {error.image && (
                    <span className="text-xs font-medium text-destructive flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {error.image?.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Enhanced Dialog Footer */}
              <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto order-2 sm:order-1 h-12 border-border hover:bg-accent transition-all duration-300"
                >
                  Cancel
                </Button>
                {loading ? (
                  <Button
                    disabled
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 h-12 transition-all duration-300 order-1 sm:order-2 text-primary-foreground"
                  >
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Creating Menu...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 h-12 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden order-1 sm:order-2 text-primary-foreground"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Plus className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    Create Menu Item
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Menu Items Grid */}
      <div className="space-y-6">
        {restaurant?.menus && restaurant.menus.length > 0 ? (
          restaurant.menus.map((menu: MenuItem, idx: number) => (
            <div
              key={menu._id || idx}
              className="bg-card rounded-2xl shadow-lg hover:shadow-xl border border-border overflow-hidden transition-all duration-500 hover:-translate-y-1 group"
            >
              <div className="flex flex-col md:flex-row">
                {/* Enhanced Menu Image */}
                <div className="md:w-56 md:h-56 w-full h-64 relative overflow-hidden">
                  <img
                    src={menu.image}
                    alt={menu.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Enhanced Menu Details */}
                <div className="flex-1 p-8">
                  <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-4">
                      <h1 className="text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">
                        {menu.name}
                      </h1>
                      <p className="text-muted-foreground text-lg leading-relaxed line-clamp-2">
                        {menu.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IndianRupee className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-primary">
                          ₹{menu.price}
                        </h2>
                      </div>
                    </div>

                    {/* Enhanced Edit Button */}
                    <div className="mt-6 pt-6 border-t border-border">
                      <Button
                        onClick={() => {
                          setSelectedMenu(menu);
                          setEditOpen(true);
                        }}
                        size="lg"
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group/edit"
                      >
                        <Edit className="mr-2 h-4 w-4 group-hover/edit:scale-110 transition-transform duration-200" />
                        Edit Item
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Enhanced Empty State */
          <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-lg">
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-1 bg-primary/20 rounded-full blur opacity-20 animate-pulse"></div>
              <Utensils className="h-20 w-20 text-muted-foreground relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground mb-3">
              No Menu Items Yet
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Start by adding your first menu item to showcase your restaurant's
              culinary excellence and attract more customers
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First Menu
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </div>

      {/* Edit Menu Dialog */}
      <EditMenu
        selectedMenu={selectedMenu}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        onMenuDelete={() => {
          // This will force a re-render when a menu is deleted
          setSelectedMenu(null);
        }}
      />
    </div>
  );
};

export default AddMenu;
