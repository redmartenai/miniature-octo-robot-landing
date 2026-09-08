import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

import Record from "@/sections/Record";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Reveal><Record /></Reveal>
      </main>
      <Footer />
    </>
  );
}
