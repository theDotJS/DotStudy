import type { Metadata } from "next";
import { Chaves } from "./chaves";

export const metadata: Metadata = {
  title: "Notificação · DotStudy",
};

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Notificação</h1>
      <Chaves />
    </>
  );
}
