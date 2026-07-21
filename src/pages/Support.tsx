import SupportAssistant from '@/components/support/SupportAssistant';

const Support = () => {
  return (
    <div className="min-h-screen bg-sand-light">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-olive-dark">Aide & Support</h1>
          <p className="mt-2 text-olive-dark/80">
            L'Assistant Support Zeytna répond à vos questions, prépare vos demandes et
            transmet à l'équipe humaine si besoin.
          </p>
        </header>
        <SupportAssistant />
      </div>
    </div>
  );
};

export default Support;