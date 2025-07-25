import React from "react";

export function HubspotForm({
  formId,
  onFormSubmitted,
}: {
  formId: string;
  onFormSubmitted?: () => void;
}) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    const windowAsAny = window as any;
    setIsClient(true);

    // Load HubSpot script if not already loaded
    if (typeof window !== "undefined" && !windowAsAny.hbspt) {
      const script = document.createElement("script");
      script.src = "//js.hsforms.net/forms/embed/v2.js";
      script.async = true;
      script.onload = () => {
        // Create the form after script loads
        if (windowAsAny.hbspt) {
          windowAsAny.hbspt.forms.create({
            portalId: "21748317",
            formId: formId,
            region: "na1",
            target: `#hubspot-form-${formId}`,
            onFormSubmitted: onFormSubmitted,
          });
        }
      };
      document.head.appendChild(script);
    } else if (windowAsAny.hbspt) {
      // Script already loaded, create form immediately
      windowAsAny.hbspt.forms.create({
        portalId: "21748317",
        formId: formId,
        region: "na1",
        target: `#hubspot-form-${formId}`,
        onFormSubmitted: onFormSubmitted,
      });
    }
  }, [formId]);

  // Only render the container div on the client
  if (!isClient) {
    return <div id={`hubspot-form-${formId}`} />;
  }

  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        /* Container styles */
        .hubspot-form {
          min-height: 200px;
          min-width: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.02) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        /* Form element styles */
        .hubspot-form form {
          background: transparent !important;
        }

        .hubspot-form .hs-form-field {
          margin-bottom: 20px !important;
        }

        /* Label styles */
        .hubspot-form .hs-form-field label {
          display: block !important;
          color: white !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          margin-bottom: 8px !important;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif !important;
        }

        /* Specific styles for text and email inputs */
        .hubspot-form input[type="text"],
        .hubspot-form input[type="email"] {
          width: 100% !important;
          padding: 12px 16px !important;
          border: 2px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px !important;
          background: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
          font-size: 14px !important;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif !important;
          transition: all 0.3s ease !important;
          outline: none !important;
          margin-bottom: 8px !important;
          box-sizing: border-box !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }

        .hubspot-form input[type="text"]:focus,
        .hubspot-form input[type="email"]:focus {
          border-color: #0066cc !important;
          background: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1) !important;
        }

        .hubspot-form input[type="text"]::placeholder,
        .hubspot-form input[type="email"]::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }

        /* Button styles */
        .hubspot-form .hs-button {
          margin-top: 23px;
          background: #0052ff;
          color: white !important;
          border: 1px solid #0052ff !important;
          padding: 14px 28px !important;
          border-radius: 8px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          text-transform: none !important;
          letter-spacing: 0.5px !important;
          width: auto !important;
          min-width: 200px !important;
        }

        .hubspot-form .hs-button:hover {
          background-color: transparent;
          color: #0052ff;
          border: 1px solid #0052ff;
        }

        .hubspot-form .hs-button:active {
          transform: translateY(0) !important;
          box-shadow: 0 2px 8px rgba(0, 102, 204, 0.3) !important;
        }

        /* Error message styles */
        .hubspot-form .hs-error-msgs {
          color: #ff6b6b !important;
          font-size: 12px !important;
          margin-top: 4px !important;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif !important;
        }

        .hubspot-form .hs-error-msgs ul {
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        /* Privacy notice styles */
        .hubspot-form .hs-form-field .hs-form-field__reminder {
          color: rgba(255, 255, 255, 0.7) !important;
          font-size: 12px !important;
          margin-top: 8px !important;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif !important;
        }

        .hubspot-form .hs-form-field .hs-form-field__reminder a {
          color: #0066cc !important;
          text-decoration: underline !important;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .hubspot-form {
            padding: 16px !important;
          }

          .hubspot-form input[type="text"],
          .hubspot-form input[type="email"] {
            padding: 10px 14px !important;
            font-size: 16px !important; /* Prevents zoom on iOS */
          }

          .hubspot-form .hs-button {
            width: 100% !important;
            padding: 16px 24px !important;
          }
        }
      `}</style>
      <div id={`hubspot-form-${formId}`} className="hubspot-form" />
    </>
  );
}
