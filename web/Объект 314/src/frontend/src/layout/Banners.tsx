import { AccountPanel } from "../components/AccountPanel";

const lambda = new URL("../../assets/banners/lambda.png", import.meta.url);

export function Banners() {
  return (
    <div>
      <img className="pl-3 w-full" src={lambda.toString()} />
      <AccountPanel className="pl-3 w-full" />
    </div>
  );
}
