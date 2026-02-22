export const CtaSection = () => {
    return (
        <div className="mt-30 border-t border-gray-800 pb-30">
            <div className="pb-20 grid grid-cols-1 md:grid-cols-2 border-b border-gray-800 p-6 md:p-20">
                <h3 className="font-urbanist text-4xl/12 max-md:text-center font-bold max-w-lg bg-linear-to-r from-white to-white/50 bg-clip-text text-transparent">
                    Get clean, modern template for your startup.
                </h3>
                <div className="flex items-center justify-center md:justify-end max-md:mt-10 md:pr-20">
                    <button className="bg-primary hover:bg-secondary transition duration-300 text-black px-6 py-2.5 rounded-lg">
                        Download now
                    </button>
                </div>
            </div>
        </div>
    );
};