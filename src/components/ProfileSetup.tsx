import ExperienceFlow from './onboarding/ExperienceFlow';

/**
 * Entry point shown by ProtectedRoute when an authenticated user has no
 * detail profile yet. We delegate the full audio-first onboarding to
 * ExperienceFlow (user-type selection → audio recording → AI extraction →
 * confirmation screen).
 */
const ProfileSetup = () => <ExperienceFlow />;

export default ProfileSetup;