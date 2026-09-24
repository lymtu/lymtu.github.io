import { Outlet } from "react-router";
import { Header } from "./components/header";

export default function AppPage() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <div className="h-20 flex justify-center items-center">- end -</div>
    </>
  );
}
