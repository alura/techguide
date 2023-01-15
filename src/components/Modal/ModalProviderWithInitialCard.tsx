import ItemContent from "@src/screens/PathScreen/patterns/TShape/patterns/TItemCard/ItemContent";
import { useRouter } from "next/router";
import React from "react";
import { ModalProvider } from "./index";

export function ModalProviderWithActiveCard({
  children,
  modalInitialData,
}: any) {
  const router = useRouter();
  const isOpenInitialState = Boolean(router.query.activeCardSlug);
  const InitialChildrenComponent = () => <ItemContent {...modalInitialData} />;

  React.useEffect(() => {
    isOpenInitialState && document.body.classList.add("lock-scroll");
  }, []);

  function onClose() {
    if (router.query.activeCardSlug) {
      const newPath = window.location.pathname
        .split("/")
        .filter(Boolean)
        .slice(0, -1)
        .join("/");
      globalThis.history.pushState(
        globalThis.history.state,
        undefined,
        `/${newPath}/`
      );
    } else {
      globalThis.history.pushState(
        globalThis.history.state,
        undefined,
        globalThis.history.state.as
      );
    }
  }

  return (
    <ModalProvider
      isOpenInitialState={isOpenInitialState}
      onClose={onClose}
      InitialChildrenComponent={InitialChildrenComponent}
    >
      {children}
    </ModalProvider>
  );
}
