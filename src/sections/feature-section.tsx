import { SectionTitle } from "../components/section-title";
import { features } from "../data/features";

export const FeatureSection = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="py-24">
                <SectionTitle
                    title="What We Offer"
                    description="Explore amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat."
                />
            </div>
            <div className="border-t border-gray-800 grid grid-cols-1 md:grid-cols-3">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="md:border-r border-b md:nth-[3]:border-r-0 md:nth-[6]:border-r-0 border-gray-800 hover:bg-white/5 flex flex-col items-start justify-center p-10"
                    >
                        <div className="p-2 rounded-lg bg-secondary">
                            <feature.icon className="size-7" />
                        </div>
                        <h3 className="text-lg font-medium mt-6">{feature.title}</h3>
                        <p className="text-sm text-gray-500 mt-3">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};