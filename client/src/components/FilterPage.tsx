import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Filter, X } from "lucide-react";
import { Badge } from "./ui/badge";

export type FilterOptionsState = {
  id: string;
  label: string;
};

const filterOptions: FilterOptionsState[] = [
  { id: "italian", label: "Italian" },
  { id: "burger", label: "Burger" },
  { id: "thali", label: "Thali" },
  { id: "biryani", label: "Biryani" },
  { id: "momos", label: "Momos" },
  { id: "pizza", label: "Pizza" },
  { id: "sushi", label: "Sushi" },
  { id: "pasta", label: "Pasta" },
  { id: "salad", label: "Salad" },
];

const FilterPage = () => {
  const { setAppliedFilter, appliedFilter, resetAppliedFilter } =
    useRestaurantStore();

  const appliedFilterHandler = (value: string) => {
    setAppliedFilter(value);
  };

  const hasActiveFilters = appliedFilter.length > 0;

  return (
    <div className="lg:w-80 bg-card rounded-2xl shadow-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-card-foreground">Filters</h1>
            <p className="text-sm text-muted-foreground">
              Choose your favorite cuisines
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAppliedFilter}
            className="text-primary hover:text-primary/80 hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Badge */}
      {hasActiveFilters && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-card-foreground">
              Active filters:
            </span>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {appliedFilter.length}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {appliedFilter.map((filter, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-primary/5 text-primary border-primary/20 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 group hover:bg-primary/10 transition-colors duration-200"
              >
                {filter}
                <X
                  size={14}
                  className="cursor-pointer opacity-70 group-hover:opacity-100 transition-opacity duration-200 hover:text-primary/80"
                  onClick={() => appliedFilterHandler(filter)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Filter Options */}
      <div className="space-y-3">
        <h3 className="font-semibold text-card-foreground text-sm uppercase tracking-wide mb-4">
          Cuisine Types
        </h3>

        <div className="grid gap-3">
          {filterOptions.map((option) => {
            const isChecked = appliedFilter.includes(option.label);
            return (
              <div
                key={option.id}
                className={`flex items-center space-x-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer group ${
                  isChecked
                    ? "bg-primary/10 border-primary/30 shadow-sm"
                    : "bg-accent border-border hover:bg-accent/80"
                }`}
                onClick={() => appliedFilterHandler(option.label)}
              >
                <div className="relative">
                  <Checkbox
                    id={option.id}
                    checked={isChecked}
                    className={`w-5 h-5 border-2 ${
                      isChecked ? "bg-primary border-primary" : "border-border"
                    } transition-colors duration-200`}
                  />
                </div>
                <Label
                  htmlFor={option.id}
                  className={`flex-1 text-sm font-medium leading-none cursor-pointer select-none transition-colors duration-200 ${
                    isChecked
                      ? "text-primary"
                      : "text-card-foreground group-hover:text-card-foreground/90"
                  }`}
                >
                  {option.label}
                </Label>

                {isChecked && (
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset All Button - Bottom */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={resetAppliedFilter}
            className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary/80 hover:border-primary/50 transition-all duration-200 py-2.5 rounded-xl font-medium"
          >
            <X className="w-4 h-4 mr-2" />
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterPage;
