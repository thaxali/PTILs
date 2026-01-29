import { getAllPtils } from "@/lib/ptils";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  const ptils = getAllPtils();
  return <HomeClient ptils={ptils} />;
}
