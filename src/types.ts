import type { LucideIcon } from "lucide-react";

export interface IFeature {
    icon: LucideIcon;
    title: string;
    description: string;
};

export interface IWork {
    title: string;
    image: string;
}

export interface ITestimonial {
    id: number;
    name: string;
    title: string;
    quote: string;
    avatar: string;
    handle: string;
    rating: 1 | 2 | 3 | 4 | 5;
}

export interface IFaq {
    question: string;
    answer: string;
}