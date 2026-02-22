import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: "Home", href: "/" },
        { name: "Products", href: "/" },
        { name: "Resources", href: "/" },
        { name: "Pricing", href: "/" },
        { name: "About", href: "/" },
    ];

    return (
        <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-800">
            <Link to='/' className="flex items-center gap-2">
                <img src="/logo.svg" alt="Logo" width={127} height={32} />
            </Link>
            <ul className="max-md:hidden flex items-center gap-8">
                {links.map((link) => (
                    <li key={link.name}>
                        <Link to={link.href} className="hover:opacity-70 py-1">
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
            <button className="max-md:hidden bg-primary hover:bg-secondary transition duration-300 text-black px-6 py-2.5 rounded-lg">
                Get Started
            </button>
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                <MenuIcon className="size-6" />
            </button>
            <div className={`flex flex-col items-center justify-center gap-6 text-lg fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {links.map((link) => (
                    <Link
                        key={link.name}
                        to={link.href}
                    >
                        {link.name}
                    </Link>
                ))}
                <button onClick={() => setIsOpen(false)}>
                    <XIcon className="size-6" />
                </button>
            </div>
        </div>
    );
};