import React from "react";
import Box from "../Box";

interface ModalContextValue {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  open: (ChildrenComponent: any) => void;
  close: () => void;
  ChildrenComponent: any;
}
const ModalContext = React.createContext<ModalContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  ChildrenComponent: () => "No Children Provided",
});

export const useModal = () => React.useContext(ModalContext);

interface ModalProviderProps {
  isOpenInitialState?: boolean;
  InitialChildrenComponent?: () => JSX.Element;
  onClose: () => void;
  children: React.ReactNode;
}
export function ModalProvider({
  children,
  onClose,
  isOpenInitialState,
  InitialChildrenComponent,
}: ModalProviderProps) {
  const [isOpen, setIsOpen] = React.useState(isOpenInitialState || false);
  const [ChildrenComponent, setChildrenComponent] = React.useState<any>(
    InitialChildrenComponent
  );

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        open(newChildrenComponent) {
          document.body.classList.add("lock-scroll");
          setIsOpen(true);
          setChildrenComponent(newChildrenComponent);
        },
        close() {
          document.body.classList.remove("lock-scroll");
          onClose && onClose();
          setIsOpen(false);
          setChildrenComponent(() => "");
        },
        ChildrenComponent,
      }}
    >
      {children}
      {isOpen && <Modal />}
    </ModalContext.Provider>
  );
}

export default function Modal() {
  const modal = useModal();
  const ChildrenComponent = modal.ChildrenComponent;
  return (
    <Box
      className="modal-base"
      styleSheet={{
        position: "fixed",
        width: "100%",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(1, 11, 24, 0.8)",
        "z-index": "100",
        color: "#FFFFFF",
        alignItems: "flex-end",
      }}
      onClick={(event) => {
        const isBackDrop = event.target.classList.contains("modal-base");
        if (isBackDrop) {
          modal.close();
        }
      }}
    >
      {ChildrenComponent}
    </Box>
  );
}
