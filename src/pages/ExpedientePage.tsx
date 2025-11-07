import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import type { Expediente, ClinicalRecord } from '../types/expediente';
import { fetchExpedientes, fetchPatientHistory } from '../services/api';
import PatientCard from '../components/PatientCard';
import PatientDetails from '../components/PatientDetails';
import LogoutButton from '../components/LogoutButton';

const ExpedientesPage: React.FC = () => {
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
    } else setHistory(null);
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
  const handleLogout = () => {
    console.log("Logout"); // Reemplazar por lógica real
  };

  return (
    <div className="h-screen bg-light font-sans p-4 md:p-8 flex flex-col">
  {/* Header fijo */}
  <header className="mb-4 text-center sticky top-0 bg-light z-20">
    <LogoutButton onLogout={handleLogout} />
    <h1 className="text-4xl font-extrabold text-primary tracking-tight">
      Sistema de Expedientes Clínicos
    </h1>
    <p className="text-secondary mt-1">Clínica Odontológica</p>
  </header>

  {/* Buscador fijo */}
  <div className="mb-4 max-w-6xl mx-auto sticky top-[4.5rem] bg-light z-20 pb-4">
    <div className="relative max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Buscar..."
        className="w-full p-3 pl-10 border border-primary rounded-xl shadow-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
    </div>
  </div>

  {/* Contenido con scroll solo en las secciones */}
  <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto overflow-hidden">
    
    {/* Lista de expedientes con scroll */}
     <section className="bg-light p-4 rounded-xl shadow-lg flex flex-col flex-1 overflow-y-auto pt-0">
    <h2 className="text-2xl font-semibold mb-4 text-primary sticky top-0 bg-light pb-2 z-10">
      Expedientes ({filteredExpedientes.length})
    </h2>

    {!isLoadingList && filteredExpedientes.map(e => (
      <PatientCard
        key={e.id}
        expediente={e}
        isSelected={e.pacienteId === selectedPatientId}
        onClick={handlePatientSelect}
      />
    ))}
  </section>

    {/* Detalle del paciente con scroll */}
    <section className="col-span-1 md:col-span-2 flex flex-col flex-1 overflow-y-auto">
      {selectedExpediente && history !== null ? (
        <PatientDetails history={history} expediente={selectedExpediente} />
      ) : (
        <div className="p-6 bg-light rounded-xl shadow-xl h-full flex items-center justify-center">
          <p className="text-secondary text-lg">
            Selecciona una ficha de expediente para ver el historial clínico.
          </p>
        </div>
      )}
    </section>
  </main>
</div>

  );
};

export default ExpedientesPage;
