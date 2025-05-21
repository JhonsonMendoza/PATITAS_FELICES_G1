import { useState, useRef, useEffect } from "react";
import { Button, Avatar } from "@material-tailwind/react";
import { RiGlobalLine } from "react-icons/ri";
import { SlSettings } from "react-icons/sl";
import { BsPersonSlash } from "react-icons/bs";
import { FaSignOutAlt, FaCrown, FaChartBar, FaGlobe } from "react-icons/fa";
import { HiOutlineX } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const DropdownUser = () => {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trigger = useRef<HTMLElement | null>(null);
    const dropdown = useRef<HTMLDivElement>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const clickHandler = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                !dropdown.current ||
                (dropdown.current as HTMLElement).contains(target) ||
                (trigger.current as HTMLElement).contains(target)
            )
                return;
            setDropdownOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    }, []);

    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (keyCode === 27) setDropdownOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    }, []);

    const handleLogout = () => {
        console.log("Logging out...");
        router.push('/login'); // Redirige a la página de login
        // Aquí puedes conectar con tu lógica de logout
    };

    const handleDeleteAccount = () => {
        console.log("Deleting account...");
        // Aquí puedes conectar con tu lógica de eliminación
    };

    return (
        <div className="relative">
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-4 cursor-pointer"
            >
                <span className="bg-white h-10 w-10 overflow-hidden rounded-full border">
                    <Avatar
                        src="/perfil.png" // Imagen estática
                        alt="User"
                        className="" placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </span>
                <svg className="hidden fill-current sm:block" width="12" height="8" viewBox="0 0 12 8">
                    <path d="M0.41 0.91C0.74 0.59 1.26 0.59 1.59 0.91L6 5.32L10.41 0.91C10.74 0.59 11.26 0.59 11.59 0.91C11.91 1.24 11.91 1.76 11.59 2.09L6.59 7.09C6.26 7.41 5.74 7.41 5.41 7.09L0.41 2.09C0.09 1.76 0.09 1.24 0.41 0.91Z" />
                </svg>
            </button>

            <div
                ref={dropdown}
                className={`absolute right-0 z-50 mt-4 w-80 rounded-3xl border border-stroke bg-white shadow-xl dark:bg-boxdark ${dropdownOpen ? "block" : "hidden"}`}
            >
                <div className="flex items-center gap-4 p-5 border-b border-stroke">
                    <Avatar
                        src="/perfil.png"
                        alt="User"
                        className="h-16 w-16 border-2 border-primary" placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <div>
                        <p className="text-lg font-semibold text-[#212121]">Nombre de Usuario</p>
                        <span className="text-xs px-2 bg-emerald-400 text-white py-0.5 rounded-full">Usuario Activo</span>
                    </div>
                </div>

                {/* Beneficios */}
                <div className="p-4 text-center border-b border-stroke">
                    <div className="font-semibold text-sm text-[#212121] mb-3">Beneficios de la plataforma</div>
                    <div className="flex justify-around">
                        <div className="flex flex-col items-center text-xs text-[#212121]">
                            <FaCrown className="text-xl mb-1" />
                            Control
                        </div>
                        <div className="flex flex-col items-center text-xs text-[#212121]">
                            <FaChartBar className="text-xl mb-1" />
                            Estadísticas
                        </div>
                        <div className="flex flex-col items-center text-xs text-[#212121]">
                            <FaGlobe className="text-xl mb-1" />
                            Distribución
                        </div>
                    </div>
                </div>

                {/* Acciones */}
                <ul className="flex flex-col text-sm px-6 py-4 gap-3">
                    <li>
                        <Link href="/profile" className="flex items-center gap-3 text-[#212121] hover:text-primary">
                            <RiGlobalLine size={20} />
                            Mi Perfil
                        </Link>
                    </li>
                    <li>
                        <Link href="/settings" className="flex items-center gap-3 text-[#212121] hover:text-primary">
                            <SlSettings size={20} />
                            Configuración
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 text-[#212121] hover:text-red-600 w-full"
                        >
                            <FaSignOutAlt size={20} />
                            Cerrar sesión
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-3 text-[#212121] hover:text-red-700 w-full"
                        >
                            <BsPersonSlash size={20} />
                            Eliminar cuenta
                        </button>
                    </li>
                </ul>
            </div>

            {/* Modal de confirmación de eliminación */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl relative">
                        <HiOutlineX
                            className="absolute right-3 top-3 text-gray-600 cursor-pointer"
                            onClick={() => setShowDeleteConfirm(false)}
                            size={20}
                        />
                        <h2 className="text-lg font-bold text-[#212121] mb-2">¿Estás seguro?</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Esta acción eliminará tu cuenta permanentemente. ¿Deseas continuar?
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button onClick={() => setShowDeleteConfirm(false)} variant="outlined" className="rounded-full text-sm" placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                Cancelar
                            </Button>
                            <Button onClick={handleDeleteAccount} className="bg-red-600 text-white rounded-full text-sm" placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownUser;
