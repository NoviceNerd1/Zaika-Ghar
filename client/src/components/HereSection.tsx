import { useState } from "react";
import { Input } from "./ui/input";
import { Search, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import HereImage from "@/assets/zaika-ghar.jpg";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/search/${searchText.trim()}`);
    } else {
      navigate("/search");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto items-center justify-between gap-12 lg:gap-20">
        {/* Text Content */}
        <div className="flex flex-col gap-8 lg:w-[45%] text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full w-fit mx-auto lg:mx-0">
            <Sparkles className="size-4" />
            <span className="text-sm font-medium">Fastest Food Delivery</span>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-6">
            <h1 className="font-bold text-4xl lg:text-6xl leading-tight text-foreground">
              Order Food{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Anytime
              </span>{" "}
              &{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Anywhere
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hey! Our delicious food is waiting for you. We're always near to
              satisfy your cravings with lightning-fast delivery.
            </p>
          </div>

          {/* Search Section */}
          <div className="flex flex-col gap-4">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-muted-foreground size-5 z-10" />
              <Input
                type="text"
                value={searchText}
                placeholder="Search restaurant by name, city & country..."
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-4 py-6 text-lg border-2 border-border focus:border-primary/50 shadow-xl rounded-2xl focus-visible:ring-0 transition-all duration-300 bg-card text-card-foreground"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Search className="mr-2 size-5" />
              {searchText.trim()
                ? "Search Restaurants"
                : "Explore All Restaurants"}
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
            <div className="text-center">
              <div className="font-bold text-2xl text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-foreground">50+</div>
              <div className="text-sm text-muted-foreground">Cities</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-foreground">10k+</div>
              <div className="text-sm text-muted-foreground">
                Happy Customers
              </div>
            </div>
          </div>
        </div>

        {/* Image Content */}
        <div className="lg:w-[50%] relative">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-primary/70 rounded-3xl blur-lg opacity-20"></div>
            <img
              src={HereImage}
              alt="Delicious pizza ready for delivery"
              className="relative rounded-2xl shadow-2xl object-cover w-full max-w-2xl transform hover:scale-105 transition-transform duration-500 border border-border"
            />
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 bg-card px-4 py-3 rounded-2xl shadow-lg border border-border">
            <div className="font-semibold text-card-foreground">
              🔥 Hot & Fresh
            </div>
            <div className="text-sm text-muted-foreground">30 min delivery</div>
          </div>

          <div className="absolute -bottom-4 -left-4 bg-card px-4 py-3 rounded-2xl shadow-lg border border-border">
            <div className="font-semibold text-card-foreground">
              ⭐ 4.8 Rating
            </div>
            <div className="text-sm text-muted-foreground">2k+ reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
