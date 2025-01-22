import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tree, Users, Search } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-sand-light">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-olive-dark mb-6 animate-fadeIn">
            Connectez-vous à la récolte d'olives
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto animate-fadeIn">
            La première plateforme tunisienne qui met en relation les propriétaires d'oliviers et les cueilleurs professionnels.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-fadeIn">
            <Button className="bg-olive hover:bg-olive-dark text-white px-8 py-6 text-lg">
              Je suis propriétaire
            </Button>
            <Button className="bg-olive-dark hover:bg-olive text-white px-8 py-6 text-lg">
              Je suis cueilleur
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-olive-dark mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-olive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-olive" />
              </div>
              <h3 className="text-xl font-semibold text-olive-dark mb-2">Créez votre profil</h3>
              <p className="text-gray-600">Inscrivez-vous en tant que propriétaire ou cueilleur et complétez votre profil.</p>
            </div>
            <div className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-olive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-olive" />
              </div>
              <h3 className="text-xl font-semibold text-olive-dark mb-2">Trouvez votre match</h3>
              <p className="text-gray-600">Recherchez des propriétaires ou des cueilleurs selon vos critères.</p>
            </div>
            <div className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-olive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tree className="w-8 h-8 text-olive" />
              </div>
              <h3 className="text-xl font-semibold text-olive-dark mb-2">Commencez la récolte</h3>
              <p className="text-gray-600">Planifiez la récolte et profitez d'une collaboration fructueuse.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;