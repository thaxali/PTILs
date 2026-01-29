import { getAllPtils } from "@/lib/ptils";
import SavedClient from "@/components/SavedClient";

export default function SavedPage() {
  const ptils = getAllPtils();
  return <SavedClient ptils={ptils} />;
}
