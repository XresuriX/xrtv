import { SectionTitle } from "../components/section-title";
import { testimonials } from "../data/testimonials";
import { ArrowRightIcon, StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const TestimonialSection = () => {
    const [autoPlay, setAutoPlay] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const testimonial = testimonials[currentIndex];

    useEffect(() => {
        if (!autoPlay) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [autoPlay]);

    return (
        <div className="mt-30 border-y border-gray-800">
            <div className="p-6 md:p-24">
                <SectionTitle
                    title="Our Testimonial."
                    description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit."
                    leftAlign
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-800 border-t border-gray-800">
                <div
                    onMouseEnter={() => setAutoPlay(false)}
                    onMouseLeave={() => setAutoPlay(true)}
                >
                    {testimonials.map((item, index) => (
                        <div
                            key={item.id}
                            onMouseEnter={() => setCurrentIndex(index)}
                            className={`flex items-center gap-4 py-8 px-12 border-b border-gray-800 last:border-b-0
                                ${index === currentIndex ? 'bg-white/5' : 'hover:bg-white/5'}`}
                        >
                            <img
                                src={item.avatar}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="rounded-full"
                            />
                            <div>
                                <p className="text-lg font-medium">{item.name}</p>
                                <p className="text-gray-500">{item.handle}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 md:p-20 max-md:border-t border-gray-800 flex flex-col items-start">
                    <div className="inline-flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <StarIcon
                                key={i}
                                className="size-5 text-yellow-500 fill-yellow-500"
                            />
                        ))}
                    </div>

                    <p className="mt-6 text-lg font-medium italic">
                        "{testimonial.title}"
                    </p>

                    <p className="mt-4 text-base/7 text-gray-400">
                        {testimonial.quote}
                    </p>

                    <Link to="/" className="mt-8">
                        Read more
                        <ArrowRightIcon className="inline-block size-4 ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
};