import { useLocation, Navigate } from "react-router-dom";
import Loading from "@/components/Loading";
import { useAuthGuard, type AuthRequirements } from "@/hooks/useAuthGuard";

interface RouteGuardProps {
  children: React.ReactNode;
  requirements: AuthRequirements;
  fallback?: React.ReactNode;
}

export const RouteGuard = ({
  children,
  requirements,
  fallback,
}: RouteGuardProps) => {
  const location = useLocation();
  const { status, redirect } = useAuthGuard(requirements);

  if (status === "checking") {
    return fallback || <Loading />;
  }

  if (redirect) {
    return <Navigate to={redirect} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
