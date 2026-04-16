import { Heart, Camera, Truck } from "lucide-react";
import { formatSpecs } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoritesContext";
import SwipeableGallery from "@/components/SwipeableGallery";
import { navigateWithTransition } from "@/lib/viewTransition";

interface Project {
  id: string;
  title: string;
  price: string;
  specs: {
    year: number;
    mileage: number;
    engine: string;
  };
  images: string[];
}

interface FeaturedProjectsProps {
  projects: Project[];
}

const FeaturedProjects = ({ projects }: FeaturedProjectsProps) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const handleCardClick = (id: string) => {
    navigateWithTransition(`/project/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick(project.id)}
        >
          <div className="h-48 overflow-hidden">
            <SwipeableGallery images={project.images} />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(project.id);
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorites.includes(project.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }`}
                />
              </button>
            </div>
            <p className="text-xl font-bold text-blue-600 mb-4">{project.price}</p>
            <div className="flex gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Camera className="w-4 h-4" />
                {project.specs.year}
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-4 h-4" />
                {formatSpecs(project.specs.mileage)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProjects;
