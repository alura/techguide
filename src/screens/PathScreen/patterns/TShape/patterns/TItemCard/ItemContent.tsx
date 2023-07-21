import React from "react";
import { Box, Link, Text } from "@src/components";
import { useModal } from "@src/components/Modal";
import { useI18n } from "@src/infra/i18n";
import { OptionalIcon } from "@src/theme/icons/OptionalIcon";

export default function ItemContent({
  categoryTitle,
  title,
  keyObjectives,
  aluraContents,
  contents,
  optional,
}: any) {
  const i18n = useI18n();
  const modal = useModal();

  return (
    <Box
      styleSheet={{
        flex: 1,
        maxWidth: "639px",
        width: "100%",
        background: "linear-gradient(180deg, #091229 0%, #090B19 100%)",
        boxShadow: "-15px 19px 34px #00070B",
        borderRadius: "8px 0px 0px 8px",
        flexDirection: "row",
        overflowY: "scroll",
      }}
    >
      <Box
        styleSheet={{
          flex: 1,
          display: "flex",
          maxWidth: {
            xs: "40px",
            md: "70px",
          },
          position: "relative",
          color: "#FFFFFF",
          fontWeight: 400,
          alignItems: "center",
          backgroundAttatchment: "fixed",
          background:
            "linear-gradient(180deg, rgba(62, 180, 231, 0.8) 8.34%, rgba(117, 236, 234, 0.8) 32.88%, rgba(11, 12, 34, 0.8) 100%)",
        }}
      >
        <Text
          styleSheet={{
            marginTop: "24px",
            fontWeight: "400",
            fontSize: "15px",
            textTransform: "uppercase",
            writingMode: "vertical-lr",
            whiteSpace: "nowrap",
            display: "inline-block",
            overflow: "visible",
          }}
        >
          {categoryTitle}
        </Text>
      </Box>
      <Box
        styleSheet={{
          width: "100%",
          flex: 1,
        }}
      >
        <Box
          styleSheet={{
            borderTop: "1px solid rgba(233, 233, 233, 0.1)",
            borderBottom: "1px solid rgba(233, 233, 233, 0.1)",
            flexDirection: "row",
          }}
        >
          <Box
            styleSheet={{
              fontSize: "14px",
              flex: 1,
              justifyContent: "center",
              paddingLeft: "56px",
              paddingVertical: {
                xs: "22px",
                md: "35px",
              },
            }}
          >
            {/* TODO: Add after first release */}
            {/* <span>
              Marcar como{" "}
              <strong style={{ color: "#88B8DB" }}>concluída</strong>
            </span> */}
          </Box>
          <Box
            styleSheet={{
              alignItems: "center",
              justifyContent: "center",
              minHeight: "54px",
              paddingHorizontal: {
                xs: "17px",
                md: "30px",
              },
              fontSize: "0",
              cursor: "pointer",
              borderLeft: "1px solid rgba(233, 233, 233, 0.1)",
              hover: {
                opacity: ".5",
              },
            }}
            onClick={() => {
              modal.close();
            }}
          >
            <svg
              width="31"
              height="31"
              viewBox="0 0 45 45"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.0112 11.0115L33.0342 33.0344"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <path
                d="M33.0347 11.0115L11.0117 33.0344"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </svg>
          </Box>
        </Box>
        <Box
          styleSheet={{
            paddingTop: "40px",
            paddingLeft: {
              xs: "16px",
              md: "46px",
            },
            paddingRight: {
              xs: "10px",
              md: "46px",
            },
            borderBottom: "1px solid rgba(233, 233, 233, 0.1)",
          }}
        >
          {optional && (
            <Text
              styleSheet={{
                marginBottom: "17px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#88B8DB",
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                gap: "6px",
                textTransform: "uppercase",
              }}
            >
              <OptionalIcon color="#AFAEBA" size="19px" />{" "}
              {(i18n.content("TSHAPE.OPTIONAL.DESCRIPTION") as string).replace(
                "= ",
                ""
              )}
            </Text>
          )}
          <Text
            styleSheet={{
              fontWeight: "800",
              fontSize: "40px",
            }}
          >
            {title}
          </Text>
          <Box
            styleSheet={{
              marginTop: "24px",
              marginBottom: "40px",
            }}
          >
            <ul style={{ paddingLeft: "1.5ch" }}>
              {keyObjectives?.map(({ name, id }, index) => (
                <li
                  key={`${id}-${index}`}
                  style={{ fontSize: "14px", lineHeight: "1.5" }}
                >
                  {name}
                </li>
              ))}
            </ul>
          </Box>
        </Box>
        <Box
          styleSheet={{
            paddingTop: "40px",
            paddingLeft: {
              xs: "32px",
              md: "46px",
            },
            paddingRight: {
              xs: "21px",
              md: "46px",
            },
            paddingBottom: "60px",
          }}
        >
          <Text
            styleSheet={{
              fontWeight: "600",
              fontSize: "16px",
              lineHeight: "150%",
              marginBottom: "27px",
              color: "#88B8DB",
            }}
          >
            {i18n.content("PATH.T_BLOCK_SUGGESTED_CONTENT")}
          </Text>

          <Box>
            <ul style={{ listStyle: "none" }}>
              {contents?.map(({ type, title, link, id }, index) => (
                <li
                  key={`${id}-${index}`}
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.5",
                    marginBottom: "6px",
                  }}
                >
                  <Link
                    href={link}
                    styleSheet={{ textDecoration: "none" }}
                    target="_blank"
                  >
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: i18n.content(
                          `PATH.T_BLOCK_SUGGESTED_CONTENT.${
                            type || "CONTENT"
                          }.BG`
                        ),
                        color: i18n.content(
                          `PATH.T_BLOCK_SUGGESTED_CONTENT.${
                            type || "CONTENT"
                          }.COLOR`
                        ),
                        fontSize: "11px",
                        fontWeight: "600",
                        paddingLeft: "6px",
                        paddingRight: "6px",
                        borderRadius: "2px",
                        marginRight: "8px",
                        textTransform: "uppercase",
                      }}
                    >
                      {i18n.content(
                        `PATH.T_BLOCK_SUGGESTED_CONTENT.${
                          type || "CONTENT"
                        }.LABEL`
                      )}
                    </span>
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </Box>
          <Box>
            <ul style={{ listStyle: "none" }}>
              {aluraContents?.map(({ type, title, link, id }) => (
                <li
                  key={id}
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.5",
                    marginBottom: "6px",
                    position: "relative",
                  }}
                >
                  <Link
                    href={link}
                    styleSheet={{ textDecoration: "none" }}
                    target="_blank"
                  >
                    <svg
                      width="15"
                      height="14"
                      viewBox="0 0 15 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        position: "absolute",
                        transform: "translateX(-100%)",
                        left: "-6px",
                        top: "5px",
                      }}
                    >
                      <circle cx="7.26758" cy="7" r="7" fill="#03C2E0" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.29829 7.02539C8.28531 7.10789 8.23504 7.17996 8.16182 7.22106C8.08903 7.26771 8.02535 7.29104 7.96091 7.31437C7.82368 7.36141 7.67925 7.40844 7.52648 7.463C7.36537 7.51756 7.22094 7.57212 7.09206 7.61163C6.93133 7.66619 6.77856 7.71323 6.63337 7.76779C6.52414 7.81419 6.42154 7.87466 6.32821 7.94765C6.24142 8.02571 6.16567 8.11507 6.10304 8.2133C6.03859 8.32242 5.99803 8.46315 5.99803 8.62721C5.99803 8.9557 6.0784 9.20555 6.23951 9.36171C6.40024 9.52614 6.69819 9.60403 7.13982 9.60403C7.59017 9.60403 7.8957 9.51824 8.05719 9.34628C8.21754 9.17432 8.29791 8.93237 8.29791 8.62006V7.02539H8.29829ZM7.13797 3.56348C7.92645 3.56348 8.50531 3.71211 8.87491 4.01689C9.24489 4.31415 9.42988 4.69645 9.42988 5.14949V9.01011C9.42988 9.16627 9.39804 9.33823 9.34193 9.52562C9.28507 9.71376 9.17286 9.88534 8.99583 10.0411C8.82714 10.198 8.59401 10.3309 8.29643 10.4324C7.99886 10.534 7.61295 10.5886 7.13835 10.5886C6.6645 10.5886 6.27784 10.534 5.98064 10.4324C5.68344 10.3309 5.44993 10.198 5.28124 10.0411C5.12431 9.90075 5.00543 9.72349 4.93552 9.52562C4.87866 9.33861 4.84644 9.16665 4.84644 9.01049V8.39339C4.84644 8.0649 4.93476 7.76012 5.11179 7.49409C5.28882 7.22091 5.53788 7.03352 5.85971 6.91612C6.02044 6.86156 6.20543 6.807 6.41431 6.73664C6.62356 6.6659 6.81613 6.59553 7.00946 6.53345C7.20279 6.47061 7.37148 6.40777 7.51591 6.35283C7.60307 6.31822 7.69159 6.28709 7.78127 6.25952L7.92607 6.18915C7.98294 6.15792 8.03866 6.11088 8.09514 6.04842C8.15125 5.98634 8.19939 5.91597 8.23995 5.83771C8.28281 5.75296 8.30489 5.65935 8.30439 5.56453V5.3143C8.30499 5.22259 8.28559 5.13184 8.24753 5.04827C8.21569 4.9542 8.15125 4.86841 8.06292 4.79052C7.9746 4.71226 7.85367 4.64979 7.70924 4.60238C7.56443 4.5561 7.37186 4.53239 7.15427 4.53239C6.70392 4.53239 6.40635 4.61894 6.24562 4.79805C6.10915 4.95458 6.02878 5.14987 6.01286 5.36849C6.01286 5.41552 5.97268 5.44675 5.92416 5.44675L4.94348 5.46256C4.89499 5.46277 4.8554 5.42414 4.85478 5.37601V5.15024C4.85478 4.93087 4.89534 4.72768 4.98366 4.53239C5.07237 4.33673 5.20921 4.17305 5.39383 4.03194C5.57882 3.89159 5.82029 3.77457 6.10953 3.6963C6.39118 3.60223 6.7369 3.56348 7.13873 3.56348H7.13797Z"
                        fill="#161F31"
                      />
                    </svg>

                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: i18n.content(
                          `PATH.T_BLOCK_SUGGESTED_CONTENT.${
                            type || "CONTENT"
                          }.BG`
                        ),
                        color: i18n.content(
                          `PATH.T_BLOCK_SUGGESTED_CONTENT.${
                            type || "CONTENT"
                          }.COLOR`
                        ),
                        fontSize: "11px",
                        fontWeight: "600",
                        paddingLeft: "6px",
                        paddingRight: "6px",
                        borderRadius: "2px",
                        marginRight: "8px",
                        textTransform: "uppercase",
                      }}
                    >
                      {i18n.content(
                        `PATH.T_BLOCK_SUGGESTED_CONTENT.${
                          type || "CONTENT"
                        }.LABEL`
                      )}
                    </span>
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
