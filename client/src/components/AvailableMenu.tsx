import { type MenuItem } from "@/types/restaurantType";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useCartStore } from "@/store/useCartStore";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, Star } from "lucide-react";
import { Badge } from "./ui/badge";

const AvailableMenu = ({ menus }: { menus: MenuItem[] }) => {
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-3">
          Our Delicious Menu
        </h1>
        <p className="text-muted-foreground text-lg">
          Freshly prepared dishes just for you
        </p>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menus.map((menu: MenuItem) => (
          <Card
            key={menu._id}
            className="group bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-border hover:translate-y-[-4px]"
          >
            {/* Image Section */}
            <div className="relative overflow-hidden">
              <img
                src={menu.image}
                alt={menu.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Popular Badge */}
              <div className="absolute top-3 left-3">
                <Badge className="bg-background/95 text-primary font-semibold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1 border border-border">
                  <Star className="w-3 h-3 fill-current" />
                  Popular
                </Badge>
              </div>
              {/* Quick Add Button on Hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="sm"
                  onClick={() => {
                    addToCart(menu);
                    navigate("/cart");
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg border-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content Section */}
            <CardContent className="p-5">
              <h2 className="text-xl font-bold text-card-foreground mb-2 line-clamp-1">
                {menu.name}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                {menu.description}
              </p>

              {/* Price Section */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">Price</span>
                  <h3 className="text-2xl font-bold text-primary">
                    ₹{menu.price}
                  </h3>
                </div>
                {/* Delivery Info */}
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  <span>15-20 min</span>
                </div>
              </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="p-5 pt-0">
              <Button
                onClick={() => {
                  addToCart(menu);
                  navigate("/cart");
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105 flex items-center justify-center gap-2 border-0"
              >
                <Plus className="w-5 h-5" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State (if needed) */}
      {menus.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
            <Clock className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-card-foreground mb-2">
            Menu Coming Soon
          </h3>
          <p className="text-muted-foreground">
            We're preparing something delicious for you!
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailableMenu;
