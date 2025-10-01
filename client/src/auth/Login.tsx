import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { type LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

// Move InputField component outside of Login to prevent re-renders
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
  <div className="mb-4">
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
      <Input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className="pl-10 focus-visible:ring-2 focus-visible:ring-orange/20 transition-all duration-200"
      />
    </div>
    {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
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
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/20 px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-bold text-3xl text-gray-800 mb-2">
              Zaika Ghar
            </h1>
            <p className="text-gray-600 text-sm">
              Welcome back! Sign in to your account
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <InputField
              name="email"
              type="email"
              placeholder="Email"
              icon={Mail}
              value={input.email}
              onChange={handleInputChange}
              error={errors.email}
            />
            <InputField
              name="password"
              type="password"
              placeholder="Password"
              icon={LockKeyhole}
              value={input.password}
              onChange={handleInputChange}
              error={errors.password}
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-orange hover:text-hoverOrange transition-colors duration-200 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <div className="mb-6">
            {loading ? (
              <Button
                disabled
                className="w-full bg-orange hover:bg-hoverOrange h-11 rounded-lg transition-all duration-200"
              >
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing in...
              </Button>
            ) : (
              <Button
                type="submit"
                className="text-black-400 w-full bg-orange hover:bg-hoverOrange h-11 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
              >
                Log In
              </Button>
            )}
          </div>

          {/* Separator */}
          <div className="space-y-4">
            <Separator className="bg-gray-200" />
            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-orange hover:text-hoverOrange font-medium transition-colors duration-200"
              >
                Create account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
