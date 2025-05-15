
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import AppLayout from '@/components/AppLayout';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const NotFoundContent = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );

  return user ? (
    <AppLayout>
      <NotFoundContent />
    </AppLayout>
  ) : (
    <div className="min-h-screen flex">
      <NotFoundContent />
    </div>
  );
};

export default NotFound;
