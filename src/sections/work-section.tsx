import { SectionTitle } from "../components/section-title";
import { works } from "../data/works";

export const WorkSection = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-30 border-t border-gray-800">
            <div className="pt-24 pb-6">
                <SectionTitle
                    title="Our Latest Work."
                    description="Discover how our platform empowers you to build, deploy, and manage intelligent AI agents with ease."
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-24 p-4 md:p-8 border-b border-gray-800">
                {works.map((work, index) => (
                    <div
                        key={index}
                        className="relative group rounded-lg md:rounded-2xl overflow-hidden"
                    >
                        <img className="group-hover:opacity-60 transition duration-500" src={work.image} alt={work.title} />
                        <div className="absolute flex items-center justify-between p-3 rounded-lg -bottom-20 group-active:bottom-6 group-hover:bottom-6 left-6 right-6 bg-white transition-all duration-500 ease-in-out">
                            <h3 className="text-base text-black font-medium">{work.title}</h3>
                            <div className="bg-primary p-2 rounded-full">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.656 1.813 7.273 3.127M2.505 4.51.5 3.957m2.626 3.319L1.813 8.66M3.953.5l.553 2.005M5.23 5.68a.344.344 0 0 1 .452-.452l7.607 3.111a.346.346 0 0 1-.051.657l-3.008.72a.69.69 0 0 0-.511.51l-.72 3.009a.346.346 0 0 1-.657.05z" stroke="#000" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};