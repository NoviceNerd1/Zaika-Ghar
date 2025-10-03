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
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
  type FormEvent,
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
      removeMenuFromRestaurant(selectedMenu._id);
      setEditOpen(false);
      setShowDeleteConfirm(false);
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
    <>
      {/* Edit Menu Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl rounded-2xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                <Edit3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Edit Menu Item
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-base">
                  Update your menu to keep your offerings fresh and exciting for
                  your customers!
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
                  className="text-sm font-semibold flex items-center gap-2 text-foreground/90"
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
                  placeholder="Enter menu item name"
                  className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 border-2 bg-background/50 backdrop-blur-sm"
                />
                {error.name && (
                  <span className="text-xs font-medium text-destructive flex items-center gap-1 animate-pulse">
                    <Sparkles className="h-3 w-3" />
                    {error.name}
                  </span>
                )}
              </div>

              {/* Enhanced Description Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold flex items-center gap-2 text-foreground/90"
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
                  placeholder="Describe your menu item"
                  className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 border-2 bg-background/50 backdrop-blur-sm"
                />
                {error.description && (
                  <span className="text-xs font-medium text-destructive flex items-center gap-1 animate-pulse">
                    <Sparkles className="h-3 w-3" />
                    {error.description}
                  </span>
                )}
              </div>

              {/* Enhanced Price Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="price"
                  className="text-sm font-semibold flex items-center gap-2 text-foreground/90"
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
                  className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 border-2 bg-background/50 backdrop-blur-sm"
                  min="0"
                  step="0.01"
                />
                {error.price && (
                  <span className="text-xs font-medium text-destructive flex items-center gap-1 animate-pulse">
                    <Sparkles className="h-3 w-3" />
                    {error.price}
                  </span>
                )}
              </div>

              {/* Enhanced Image Upload Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="image"
                  className="text-sm font-semibold flex items-center gap-2 text-foreground/90"
                >
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Image className="h-3.5 w-3.5 text-primary" />
                  </div>
                  Menu Image
                </Label>
                <div className="border-2 border-dashed border-border/50 rounded-xl p-6 transition-all duration-300 hover:border-primary/50 hover:bg-accent/30 hover:shadow-lg group cursor-pointer">
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
                    className="cursor-pointer file:cursor-pointer file:bg-gradient-to-r file:from-primary file:to-primary/90 file:text-primary-foreground file:px-4 file:py-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:shadow-lg file:transition-all file:duration-300 file:hover:shadow-xl"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {selectedMenu?.image
                    ? "Upload a new image to replace the current one"
                    : "Add an appetizing photo to showcase your dish"}
                </p>
                {error.image && (
                  <span className="text-xs font-medium text-destructive flex items-center gap-1 animate-pulse">
                    <Sparkles className="h-3 w-3" />
                    {error.image?.name}
                  </span>
                )}
              </div>
            </div>

            {/* Enhanced Dialog Footer */}
            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/50">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {/* Enhanced Delete Button */}
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full sm:w-auto order-3 sm:order-1 h-12 bg-gradient-to-r from-destructive to-destructive/90 hover:from-destructive/90 hover:to-destructive shadow-lg hover:shadow-destructive/25 transform hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden"
                  disabled={loading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Trash2 className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  Delete Menu
                </Button>

                <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto order-1 sm:order-2">
                  {/* Enhanced Cancel Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditOpen(false)}
                    className="w-full sm:w-auto order-2 sm:order-1 h-12 border-2 hover:bg-accent/50 transition-all duration-300"
                    disabled={loading}
                  >
                    Cancel
                  </Button>

                  {/* Enhanced Update Button */}
                  {loading ? (
                    <Button
                      disabled
                      className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary h-12 shadow-lg transition-all duration-300 order-1 sm:order-2"
                    >
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Updating Menu...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary h-12 shadow-2xl hover:shadow-primary/25 transform hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden order-1 sm:order-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Edit3 className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      Update Menu
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl rounded-2xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold text-destructive">
                  Delete Menu Item
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Are you sure you want to delete "{selectedMenu?.name}"? This
                  action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="w-full sm:w-auto h-11 border-2 hover:bg-accent/50 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteMenu}
              className="w-full sm:w-auto h-11 bg-gradient-to-r from-destructive to-destructive/90 hover:from-destructive/90 hover:to-destructive shadow-lg hover:shadow-destructive/25 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <Trash2 className="mr-2 w-4 h-4" />
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditMenu;
