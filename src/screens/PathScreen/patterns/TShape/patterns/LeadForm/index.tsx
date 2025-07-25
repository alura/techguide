import React from "react";
import Box from "@src/components/Box";
import { useModal } from "@src/components/Modal";
import { useI18n } from "@src/infra/i18n";
import { HubspotForm } from "@src/components/HubspotForm";
import { PathScreenGetGuideBySlugQuery } from "@src/gql_types";

export function LeadForm({
  guide,
}: {
  guide: PathScreenGetGuideBySlugQuery["guide"];
}) {
  const modal = useModal();
  const i18n = useI18n();
  return (
    <>
      <Box
        tag="button"
        onClick={() => {
          modal.open(
            <Box
              styleSheet={{
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
                gap: "16px",
                padding: "16px",
                justifySelf: "center",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={(e) => {
                if (e.target.closest(".hubspot-form")) {
                  return;
                }
                modal.close();
              }}
            >
              <HubspotForm
                formId={guide.pdfFormId}
                onFormSubmitted={() => {
                  // eslint-disable-next-line no-console
                  console.log("form submitted");
                  const slug = guide.slug;
                  const locale = "PT_BR";
                  const pdfUrl = `https://raw.githubusercontent.com/alura/techguide/refs/heads/main/_data/downloadFiles/${locale}/${slug}.pdf`;
                  window.open(pdfUrl, "_blank");
                  modal.close();
                }}
              />
            </Box>
          );
        }}
        styleSheet={{
          color: "#FFFFFF",
          marginTop: "23px",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          gap: "6px",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          borderRadius: "8px",
          border: "1px solid #0052FF",
          textDecoration: "none",
          padding: "14px",
          fontSize: "14px",
          backgroundColor: "#0052FF",
          hover: {
            opacity: 1,
            backgroundColor: "transparent",
          },
          focus: {
            opacity: 1,
            backgroundColor: "transparent",
          },
        }}
      >
        {i18n.content("TSHAPE.BUTTON.DOWNLOAD_T_FILE")}
      </Box>
    </>
  );
}
