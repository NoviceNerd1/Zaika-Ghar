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
} from "lucide-react";
import React, { type FormEvent, useState } from "react";
import EditMenu from "./EditMenu";
import { type MenuFromSchema, menuSchema } from "@/schema/menuSchema";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";

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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <ChefHat className="h-7 w-7 text-primary" />
            Available Menus
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your restaurant's menu items and offerings
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              <Plus className="mr-2 h-4 w-4" />
              Add New Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md md:max-w-lg bg-card border-border shadow-xl">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-foreground">
                    Add New Menu Item
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-1">
                    Create a menu that will make your restaurant stand out.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="grid gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Utensils className="h-4 w-4" />
                    Menu Item Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={changeEventHandler}
                    placeholder="Enter menu item name"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  {error.name && (
                    <span className="text-xs font-medium text-destructive flex items-center gap-1">
                      {error.name}
                    </span>
                  )}
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Description
                  </Label>
                  <Input
                    id="description"
                    type="text"
                    name="description"
                    value={input.description}
                    onChange={changeEventHandler}
                    placeholder="Describe your menu item"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  {error.description && (
                    <span className="text-xs font-medium text-destructive flex items-center gap-1">
                      {error.description}
                    </span>
                  )}
                </div>

                {/* Price Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <IndianRupee className="h-4 w-4" />
                    Price (₹)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    name="price"
                    value={input.price}
                    onChange={changeEventHandler}
                    placeholder="Enter price in rupees"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    min="0"
                    step="0.01"
                  />
                  {error.price && (
                    <span className="text-xs font-medium text-destructive flex items-center gap-1">
                      {error.price}
                    </span>
                  )}
                </div>

                {/* Image Upload Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="image"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Image className="h-4 w-4" />
                    Menu Image
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 transition-all duration-200 hover:border-primary/50 hover:bg-accent/50">
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
                      className="cursor-pointer file:cursor-pointer file:bg-primary file:text-primary-foreground file:px-3 file:py-2 file:rounded-md file:border-0 file:text-sm"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload an appetizing photo of your menu item
                  </p>
                  {error.image && (
                    <span className="text-xs font-medium text-destructive flex items-center gap-1">
                      {error.image?.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Dialog Footer */}
              <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                {loading ? (
                  <Button
                    disabled
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 order-1 sm:order-2"
                  >
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Creating Menu...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 order-1 sm:order-2"
                  >
                    <Plus className="mr-2 w-4 h-4" />
                    Create Menu Item
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Items Grid */}
      <div className="space-y-6">
        {restaurant?.menus && restaurant.menus.length > 0 ? (
          restaurant.menus.map((menu: any, idx: number) => (
            <div
              key={menu._id || idx}
              className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden transition-all duration-200 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row">
                {/* Menu Image */}
                <div className="md:w-48 md:h-48 w-full h-56">
                  <img
                    src={menu.image}
                    alt={menu.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Menu Details */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h1 className="text-xl font-bold text-foreground mb-2">
                        {menu.name}
                      </h1>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {menu.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold text-primary">
                          {menu.price}
                        </h2>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <Button
                        onClick={() => {
                          setSelectedMenu(menu);
                          setEditOpen(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Item
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-card rounded-2xl border border-border shadow-sm">
            <Utensils className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Menu Items Yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start by adding your first menu item to showcase your restaurant's
              offerings to customers.
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
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
