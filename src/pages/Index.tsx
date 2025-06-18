
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trees, Users, Search, MessageCircle, Shield, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-sand-light">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-olive-dark mb-6 animate-fadeIn">
            {t('home.heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto animate-fadeIn">
            {t('home.heroSubtitle')}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-fadeIn">
            <Button className="bg-olive hover:bg-olive-dark text-white px-8 py-6 text-lg" asChild>
              <Link to="/owner-profile">
                {t('home.ownerButton')}
              </Link>
            </Button>
            <Button className="bg-olive-dark hover:bg-olive text-white px-8 py-6 text-lg" asChild>
              <Link to="/harvester-profile">
                {t('home.harvesterButton')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-olive-dark mb-12">
            {t('home.howItWorks')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-olive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-olive" />
              </div>
              <h3 className="text-xl font-semibold text-olive-dark mb-2">{t('home.createProfile')}</h3>
              <p className="text-gray-600">{t('home.createProfileDesc')}</p>
            </div>
            <div className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-olive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-olive" />
              </div>
              <h3 className="text-xl font-semibold text-olive-dark mb-2">{t('home.findMatch')}</h3>
              <p className="text-gray-600">{t('home.findMatchDesc')}</p>
            </div>
            <div className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-olive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-olive" />
              </div>
              <h3 className="text-xl font-semibold text-olive-dark mb-2">{t('home.communicate')}</h3>
              <p className="text-gray-600">{t('home.communicateDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6 bg-sand-light">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-olive-dark mb-12">
            {t('home.story')}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-2xl font-bold text-olive-dark mb-6">
                  {t('home.storyTitle')}
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>{t('home.storyPart1')}</p>
                  <p>{t('home.storyPart2')}</p>
                  <p>{t('home.storyPart3')}</p>
                  <p>{t('home.storyPart4')}</p>
                  <p>{t('home.storyPart5')}</p>
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-olive">
                    <div className="flex items-start gap-3 mb-3">
                      <Shield className="w-5 h-5 text-olive mt-1 flex-shrink-0" />
                      <p className="text-sm">{t('home.storyCNSS')}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-olive mt-1 flex-shrink-0" />
                      <p className="text-sm">{t('home.storyCare')}</p>
                    </div>
                  </div>
                  <p className="font-medium text-olive-dark">{t('home.storyConclusion')}</p>
                  <p className="italic text-olive-dark font-medium">{t('home.storyFinalQuote')}</p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/777e3d21-e985-4be9-89cd-b788c2ec9523.png"
                    alt="Terrain d'oliviers avec système d'irrigation"
                    className="rounded-lg shadow-lg w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-olive/10 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
