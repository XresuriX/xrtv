import HlsPlayer from "@/components/HlsPlayer";
import Animation from "@/components/animate";
import { ArrowDownRightIcon, StarIcon} from "lucide-react";

export const HeroSection = () => {
    return (
        <>
            <div className="flex flex-col max-md:px-2 items-center justify-center bg-linear-to-r from-red-500 to-yellow-300">
                <div className="mt-32 flex items-center justify-center gap-2">
                    <h1 className="text-center font-urbanist text-[42px]/13 md:text-6xl/20 font-bold max-w-2xl  bg-clip-text text-black">
                    Welcome to <span className="text-primary">XRTV</span> your adult play ground
                </h1>
                </div>
                
                <p className="text-center text-base text-black max-w-lg mt-4">
                    Explore a woke enegtertainment space for adults.
                </p>
                <div className="mt-8 flex items-center justify-center gap-4">
                    <button className="bg-primary hover:bg-secondary transition duration-300 text-black px-6 py-2.5 rounded-lg">
                        Get Started
                    </button>
                    <button className="border border-gray-600 text-zinc-300 px-4 py-2.5 rounded-lg hover:bg-gray-900">
                        See How It Works
                        <ArrowDownRightIcon className="ml-1 size-5 inline-flex" />
                    </button>
                </div>
                <div className="mt-10 flex items-center justify-center gap-2">
                    
                    
                    <div className="h-5 w-px bg-gray-400" />
                    <p className="text-gray-400 line-clamp-1">
                        Innovating UI solution 2025 by Xamayca Technologies
                    </p>
                </div>
            </div>
            <div className="p-3 md:p-6 w-full mt-16 border-t border-gray-800">
                <HlsPlayer 
                    streamName="" 
                    autoPlay={true}
                    controls={true}
                    className="rounded-xl shadow-lg"
                />
                <Animation/>
            </div>
        </>
    );
};