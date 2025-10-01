import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type MenuFromSchema, menuSchema } from "@/schema/menuSchema";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { type MenuItem } from "@/types/restaurantType";
import {
  Loader2,
  Utensils,
  FileText,
  IndianRupee,
  Image,
  Edit3,
  Trash2,
} from "lucide-react";
import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useEffect,
  useState,
} from "react";

const EditMenu = ({
  selectedMenu,
  editOpen,
  setEditOpen,
  onMenuDelete,
}: {
  selectedMenu: MenuItem;
  editOpen: boolean;
  setEditOpen: Dispatch<SetStateAction<boolean>>;
  onMenuDelete?: (menuId: string) => void;
}) => {
  const [input, setInput] = useState<MenuFromSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });
  const [error, setError] = useState<Partial<MenuFromSchema>>({});
  const { loading, editMenu, removeMenu } = useMenuStore();
  const { removeMenuFromRestaurant } = useRestaurantStore();

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

    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      if (input.image) {
        formData.append("image", input.image);
      }
      await editMenu(selectedMenu._id, formData);
      setEditOpen(false);
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleDeleteMenu = async () => {
    try {
      await removeMenu(selectedMenu._id);
      // Remove the menu from the restaurant store
      removeMenuFromRestaurant(selectedMenu._id);
      setEditOpen(false);
      // Call the parent callback if provided
      if (onMenuDelete) {
        onMenuDelete(selectedMenu._id);
      }
    } catch (error) {
      // Error is handled in the store
    }
  };

  useEffect(() => {
    setInput({
      name: selectedMenu?.name || "",
      description: selectedMenu?.description || "",
      price: selectedMenu?.price || 0,
      image: undefined,
    });
    setError({});
  }, [selectedMenu, editOpen]);

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-card border-border shadow-xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Edit3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Edit Menu Item
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                Update your menu to keep your offerings fresh and exciting!
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
                {selectedMenu?.image
                  ? "Current image will be replaced"
                  : "Upload a delicious-looking photo"}
              </p>
              {error.image && (
                <span className="text-xs font-medium text-destructive flex items-center gap-1">
                  {error.image?.name}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {/* Delete Button */}
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteMenu}
                className="w-full sm:w-auto order-3 sm:order-1"
                disabled={loading}
              >
                <Trash2 className="mr-2 w-4 h-4" />
                Delete Menu
              </Button>

              <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto order-1 sm:order-2">
                {/* Cancel Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                  className="w-full sm:w-auto order-2 sm:order-1"
                  disabled={loading}
                >
                  Cancel
                </Button>

                {/* Update Button */}
                {loading ? (
                  <Button
                    disabled
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 order-1 sm:order-2"
                  >
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Updating...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 order-1 sm:order-2"
                  >
                    <Edit3 className="mr-2 w-4 h-4" />
                    Update Menu
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMenu;
