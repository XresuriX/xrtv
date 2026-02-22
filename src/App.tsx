"use client"
import LenisScroll from "./components/lenis";
import { Navbar } from "./components/navbar";
import { HeroSection } from "./sections/hero-section";

export default function App() {
    return (
        <>
            <Navbar />
            <LenisScroll />
            <main className="mx-4 md:mx-16 lg:mx-24 xl:mx-32 border-x border-gray-800">
                <HeroSection />
                
           </main>
        </>
    )
}