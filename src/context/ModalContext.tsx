import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isConsultationModalOpen: boolean;
  initialService: string | undefined;
  openConsultationModal: (service?: string) => void;
  closeConsultationModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [initialService, setInitialService] = useState<string | undefined>(undefined);

  const openConsultationModal = (service?: string) => {
    setInitialService(service);
    setIsConsultationModalOpen(true);
  };
  const closeConsultationModal = () => {
    setIsConsultationModalOpen(false);
    setInitialService(undefined);
  };

  return (
    <ModalContext.Provider value={{ isConsultationModalOpen, initialService, openConsultationModal, closeConsultationModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
