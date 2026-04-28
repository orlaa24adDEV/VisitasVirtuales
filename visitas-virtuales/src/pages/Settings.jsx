import { useAuth } from '@/hooks/useAuth';
import CenterImageForm from '@/components/settings/CenterImageForm.jsx';
import { LayoutGrid, User } from 'lucide-react';
import UserProfileForm from '../components/settings/UserProfileForm';
import SettingsMenuItemWrapper from '../components/settings/SettingsMenuItemWrapper';

export default function Settings() {
    const { isAdmin } = useAuth();
   
    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-blue-600 p-8 text-white">
                    <h1 className="text-2xl font-bold">Configuración</h1>
                </div>
                <div className="flex flex-col divide-y divide-slate-200">
                    <div className="px-4 py-6 space-y-8">
                        <SettingsMenuItemWrapper title="Perfil de Usuario" icon={<User className="w-5 h-5" strokeWidth={2.5} />}>
                            <UserProfileForm />
                        </SettingsMenuItemWrapper>
                        <SettingsMenuItemWrapper title="Gestión de centros" icon={<LayoutGrid className="w-5 h-5" strokeWidth={2.5} />}>
                            <CenterImageForm />
                        </SettingsMenuItemWrapper>
                    </div>
                </div>
            </div>
        </div>
    );
}