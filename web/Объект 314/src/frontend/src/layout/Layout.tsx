import { Outlet } from "react-router";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { Banners } from "./Banners";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <>
      <div className="flex justify-center font-[Arial,_Helvetica,_sans-serif] text-[14px]">
        <div className="w-[1050px]">
          <Header />

          <div className="flex mt-[10px]">
            <div className="shrink-0 w-[288px]">
              <Navigation />
            </div>
            <div className="grow ml-1">
              <Outlet />
            </div>
          </div>
        </div>
        <div className="w-[150px]">
          <Banners />
        </div>
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </>
  );
}
