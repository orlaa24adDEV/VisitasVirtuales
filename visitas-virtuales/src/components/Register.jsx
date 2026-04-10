import { Link } from 'react-router-dom';
import { BrickWall, Wrench } from 'lucide-react';
import construccion from '../assets/construccion.jpg'; // Usando ruta relativa por si el @ falla
import '../assets/App.css';

const Register = () => {
    return (
        <div className="h-full flex items-center justify-center bg-white text-black p-6">
            {/* 1. Ampliamos el max-w del contenedor de 'md' a '2xl' o '3xl' */}
            <div className="flex flex-col items-center gap-8 text-center max-w-3xl w-full">
                
                <div className="relative group">
                    {/* 2. IMAGEN MUCHO MÁS GRANDE 
                        - w-full: para que use todo el ancho del contenedor.
                        - max-w-2xl: para que no se deforme en pantallas gigantes.
                        - aspect-video o h-[450px]: para darle altura imponente.
                    */}
                    <img 
                        src={construccion} 
                        alt="En construcción" 
                        className="w-full max-w-2xl h-75 md:h-112.5 object-cover rounded-3xl shadow-2xl border-8 border-gray-50 transition-transform duration-500 group-hover:scale-[1.09]" 
                    />
                    
                    {/* Un detalle extra: el icono flotando sobre la imagen grande */}
                    <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-center " >
                        <Wrench size={32} />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter">
                        ¡ESTAMOS TRABAJANDO EN ELLO!
                        <h2 className='text-black text-2xl'></h2>
                    </h1>
                    
                    <p className="text-xl text-gray-600 leading-relaxed max-w-xl mx-auto">
                        La página de registro está haciendose.
                        <span className="block italic mt-4 text-sm font-medium text-blue-500">
                            ¡Gracias por tu paciencia! 
                        </span>
                    </p>
                </div>
                
                <div className="flex gap-4 mt-2">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl hover:bg-blue-700 transition-transform font-bold shadow-xl active:scale-95 text-lg hover:scale-[1.05]"
                    >
                        <BrickWall size={30} />
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;