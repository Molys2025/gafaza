import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import DataPrivacySection from "@/components/account/DataPrivacySection";
import NotificationPreferences from "@/components/account/NotificationPreferences";

const ROLE_LABELS: Record<string, string> = {
  job_seeker: "Cueilleur",
  work_provider: "Propriétaire",
  admin: "Administrateur",
};

const Account = () => {
  const { user } = useAuth();
  const { profile } = useProfile();

  if (!user) return null;

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-olive-dark mb-6">Mon compte</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="font-semibold text-olive-dark mb-4">Informations</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Email</dt>
            <dd className="text-gray-800">{user.email}</dd>
          </div>
          {profile?.role && (
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Type de compte</dt>
              <dd className="text-gray-800">{ROLE_LABELS[profile.role] ?? profile.role}</dd>
            </div>
          )}
        </dl>
      </div>

      <NotificationPreferences />

      <DataPrivacySection />
    </div>
  );
};

export default Account;
