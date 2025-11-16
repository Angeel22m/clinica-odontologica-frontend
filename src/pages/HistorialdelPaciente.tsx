import React, {useState, useEffect,useMemo, useCallback } from 'react'; 
import { Search } from 'lucide-react';
import type { Expediente, ClinicalRecord } from '../types/expediente';
import { fetchExpedientes, fetchPatientHistory } from '../services/api';
import PatientDetails from '../components/PatientDetails';
import LogoutButton from '../components/LogoutButton';
import PatientCard from '../components/PatientCard';
import ExpedienteGeneralPanel from '../components/Expedientegeneral';

const HistorialdelPaciente: React.FC = () => {
    const [expedientes, setExpedientes] = useState<Expediente[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [history, setHistory] = useState<ClinicalRecord[] | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    useEffect(() => {
        setIsLoadingList(true);
        fetchExpedientes().then(data => {
            setExpedientes(data);
            setIsLoadingList(false);
            if (data.length > 0) setSelectedPatientId(data[0].pacienteId);
        }).catch(() => setIsLoadingList(false));
    }, []);

    useEffect(() => {
        if (selectedPatientId !== null) {
            setIsLoadingHistory(true);
            fetchPatientHistory(selectedPatientId)
                .then(data => {
                    setHistory(data);
                    setIsLoadingHistory(false);
                }).catch(() => {
                    setHistory(null);
                    setIsLoadingHistory(false);
                });
        }else setHistory(null);
    }, [selectedPatientId]);

    const handlePatientSelect = useCallback((id: number) => setSelectedPatientId(id), []);
    const filteredExpedientes = useMemo(() => {
        if (!searchTerm) return expedientes;
        const lower = searchTerm.toLowerCase();
        return expedientes.filter(e =>
            e.paciente.nombre.toLowerCase().includes(lower) ||
            e.paciente.apellido.toLowerCase().includes(lower) ||
            e.id.toString().includes(lower) ||
            e.pacienteId.toString().includes(lower)
        );
    }, [expedientes, searchTerm]);

    const selectedExpediente = expedientes.find(e => e.pacienteId === selectedPatientId);


    return (
   <div className="h-screen w-screen flex flex-col bg-light">
  {/* Header fijo */}
  <header className="py-4 text-center bg-light shadow-md z-20">
    <h3 className="text-3xl font-extrabold text-primary tracking-tight">
      Historial de Consultas del Paciente
    </h3>
    <LogoutButton/>
  </header>

  {/* Contenedor centrado */}
  <main className="flex-1 flex items-center justify-center p-6">
    <section className="w-full max-w-5xl h-[85vh] flex flex-col overflow-y-auto bg-white rounded-xl shadow-2xl border border-secondary/20">
      {selectedExpediente && history !== null ? (
        <PatientDetails history={history} expediente={selectedExpediente} />
      ) : (
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-secondary text-lg text-center">
            Selecciona una ficha de expediente para ver el historial clínico.
          </p>
        </div>
      )}
    </section>
  </main>
</div>


    )

};
export default HistorialdelPaciente;