import { SectionTitle } from "../components/section-title";
import { faqs } from "../data/faqs";
import { MinusIcon, PlusIcon } from "lucide-react";

export const FaqSection = () => {
    return (
        <div className="mt-30 grid grid-cols-1 md:grid-cols-2 border-y md:divide-x divide-gray-800 border-gray-800">
            <div className="p-6 md:p-18">
                <SectionTitle
                    title="Asked Questions."
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit."
                    leftAlign
                />
            </div>
            <div>
                <h3 className="text-lg uppercase font-medium p-6 border-b border-gray-800">
                    “General”
                </h3>
                {faqs.map((faq, index) => (
                    <details key={index} open={index === 0} className='flex flex-col border-gray-800 border-b group last:border-b-0'>
                        <summary className='flex cursor-pointer items-start justify-between gap-4 py-5 px-4 font-medium select-none'>
                            {faq.question}
                            <MinusIcon className='size-5 shrink-0 text-gray-500 hidden group-open:block' />
                            <PlusIcon className='size-5 shrink-0 text-gray-500 group-open:hidden' />
                        </summary>
                        <p className='pb-5 px-4 pr-10 text-sm/6 text-gray-500'>
                            {faq.answer}
                        </p>
                    </details>
                ))}
            </div>
        </div>
    );
};