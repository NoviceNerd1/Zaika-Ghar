import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader className="animate-spin w-16 h-16 text-primary" />
    </div>
  );
};

export default Loading;
