import { Redirect } from 'expo-router';

// Bookmarked links to the retired owner portal return to the public invitation.
export default function FormerOwnerPage() {
  return <Redirect href="/" />;
}