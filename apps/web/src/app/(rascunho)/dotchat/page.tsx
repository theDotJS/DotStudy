import type { Metadata } from "next";
import { Chat } from "./chat";

export const metadata: Metadata = {
  title: "DotChat · DotStudy",
};

export default function Page() {
  return (
    <>
      <h1 className="sr-only">DotChat</h1>
      <Chat />
    </>
  );
}
