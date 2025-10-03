import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { type LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, Mail, Sparkles, ChefHat } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Enhanced InputField component with professional styling
const InputField = ({
  name,
  type,
  placeholder,
  icon: Icon,
  value,
  onChange,
  error,
}: {
  name: string;
  type: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => (
  <div className="mb-6">
    <div className="relative group">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110">
        <Icon className="text-muted-foreground/70 group-focus-within:text-primary size-4 transition-colors duration-300" />
      </div>
      <Input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className="pl-12 pr-4 h-12 bg-background/50 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-xl"
      />
    </div>
    {error && (
      <span className="text-xs text-destructive font-medium mt-2 flex items-center gap-1 animate-pulse">
        <Sparkles className="size-3" />
        {error}
      </span>
    )}
  </div>
);

const Login = () => {
  const [input, setInput] = useState<LoginInputState>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginInputState>>({});
  const { loading, login } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginInputState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Form validation
    const result = userLoginSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors as Partial<LoginInputState>);
      return;
    }

    // API call
    try {
      await login(input);

      // Redirect to intended page or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <form
          onSubmit={handleSubmit}
          className="bg-card/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-border/50"
        >
          {/* Enhanced Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-full blur opacity-20 group-hover:opacity-100 transition duration-1000"></div>
                <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg relative">
                  <ChefHat className="size-6 text-primary-foreground" />
                </div>
              </div>
            </div>
            <h1 className="font-bold text-4xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3">
              Zaika Ghar
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome back! Sign in to your account
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-2">
            <InputField
              name="email"
              type="email"
              placeholder="Enter your email address"
              icon={Mail}
              value={input.email}
              onChange={handleInputChange}
              error={errors.email}
            />
            <InputField
              name="password"
              type="password"
              placeholder="Enter your password"
              icon={LockKeyhole}
              value={input.password}
              onChange={handleInputChange}
              error={errors.password}
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end mb-8">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:underline hover:underline-offset-4"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <div className="mb-8">
            {loading ? (
              <Button
                disabled
                className="w-full bg-gradient-to-r from-primary to-primary/90 h-12 rounded-xl shadow-lg transition-all duration-300"
              >
                <Loader2 className="mr-3 size-4 animate-spin" />
                Signing in...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary h-12 rounded-xl font-semibold text-primary-foreground shadow-2xl hover:shadow-primary/25 transform hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                Log In
              </Button>
            )}
          </div>

          {/* Enhanced Separator and Sign Up Link */}
          <div className="space-y-6">
            <div className="relative">
              <Separator className="bg-border/50" />
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-sm text-muted-foreground">
                or
              </div>
            </div>
            <p className="text-center text-muted-foreground text-base">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-primary hover:text-primary/80 transition-all duration-300 hover:underline hover:underline-offset-4"
              >
                Create account
              </Link>
            </p>
          </div>
        </form>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground/70">
            Secure login with industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
