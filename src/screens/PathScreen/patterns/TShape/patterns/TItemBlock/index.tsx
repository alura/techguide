/* eslint-disable no-undef */
import React from "react";
import { Box, Icon, Text } from "@src/components";
import { TItemBlockGrids } from "./logic";
import { useModal } from "@src/components/Modal";
import ItemContent from "./ItemContent";

export function TItemBlock({
  blocks: receivedBlocks,
  main,
  categoryName,
}: any) {
  const [extraVisible, setExtraVisible] = React.useState(false);
  const totalBlocks = receivedBlocks.length;
  const MAX_VISIBLE = 8;

  const hasExtraBlocks = totalBlocks >= MAX_VISIBLE;
  const blocks = hasExtraBlocks
    ? receivedBlocks.slice(0, MAX_VISIBLE)
    : receivedBlocks;
  const extraBlocks = hasExtraBlocks
    ? receivedBlocks.slice(MAX_VISIBLE, totalBlocks)
    : [];

  const gridStyles = {
    width: "100%",
    maxWidth: "33vw",
    display: "grid",
    aspectRatio: {
      xs: "initial",
      md: "1",
    },
    gridAutoRows: {
      xs: "1fr",
    },
    gridTemplateColumns: {
      xs: "1fr",
    },
    gap: "4px",
    marginBottom: "8px",
  };
  return (
    <>
      <Box
        styleSheet={{
          ...gridStyles,
          ...TItemBlockGrids[blocks.length],
        }}
      >
        {blocks.map((block, index) => {
          const isLastItem = blocks.length - 1 === index;
          if (hasExtraBlocks && isLastItem && !extraVisible) return null;
          return (
            <Item
              key={index}
              index={index}
              categoryName={categoryName}
              main={main}
              block={block}
            />
          );
        })}
        {hasExtraBlocks && !extraVisible && (
          <Item
            index={blocks.length - 1}
            categoryName={categoryName}
            onClick={() => setExtraVisible(!extraVisible)}
            main={main}
            block={{ item: { name: "..." } }}
          />
        )}
      </Box>
      {extraVisible && Boolean(extraBlocks.length) && (
        <Box
          styleSheet={{
            marginBottom: "8px",
            gap: "4px",
            aspectRatio: "none",
          }}
        >
          {extraBlocks.map((block, index) => (
            <Item
              key={index}
              categoryName={categoryName}
              index={index}
              main={main}
              block={block}
              extra
            />
          ))}
          <Item
            extra
            categoryName={categoryName}
            index={blocks.length - 1}
            onClick={() => setExtraVisible(!extraVisible)}
            main={main}
            block={{
              item: {
                name: (
                  <Box
                    tag="span"
                    styleSheet={{
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    Mostrar menos opções{" "}
                    <Icon name="arrowUp" styleSheet={{ marginLeft: "4px" }} />
                  </Box>
                ),
              },
            }}
          />
        </Box>
      )}
    </>
  );
}

function Item({ onClick, categoryName, index, main, block, extra }: any) {
  const modal = useModal();

  const content = {
    title: block?.item?.name || "Error",
    keyObjectives: block?.item?.keyObjectives,
    aluraContents: block?.item?.aluraContents,
    contents: block?.item?.contents,
  };

  return (
    <Box
      tag="button"
      onClick={() => {
        onClick
          ? onClick()
          : (() => {
              globalThis.history.pushState(
                globalThis.history.state,
                undefined,
                `${window.location.pathname}${block?.item?.slug}/`
              );

              modal.open(() => {
                return (
                  <ItemContent
                    categoryTitle={categoryName}
                    title={content.title}
                    keyObjectives={content.keyObjectives}
                    aluraContents={content.aluraContents}
                    contents={content.contents}
                  />
                );
              });
            })();
      }}
      styleSheet={{
        color: "inherit",
        backgroundColor: "transparent",
        minHeight: {
          xs: "80px",
          sm: "initial",
          md: "initial",
        },
        ...(extra && {
          minHeight: {
            xs: "80px",
            sm: "80px",
            md: "80px",
          },
        }),
        width: "100%",
        gridArea: {
          xs: "initial",
          sm: "initial",
          md: !extra ? `area-${index}` : "",
        },
        aspectRatio: {
          md: "unset",
          sm: "1.5",
          xs: "unset",
        },
        borderRadius: "0.25rem",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        ...(main && {
          background:
            "linear-gradient( 123.51deg, rgba(255, 255, 255, 0.4) -14.11%, rgba(255, 255, 255, 0.4) -14.11%, rgba(255, 255, 255, 0) 86.78% )",
        }),
        border: 0,
        ...(!main && {
          borderLeft: "1px solid #f5fbf213",
          borderRight: "1px solid #f5fbf244",
          backgroundImage:
            "linear-gradient(90deg, #f5fbf213, #f5fbf244), linear-gradient(90deg, #f5fbf213, #f5fbf244)",
          backgroundSize: "100% 1px",
          backgroundPosition: "0 0, 0 100%",
          backgroundRepeat: "no-repeat",
        }),
        hover: {
          ...(!main && {
            border: "1px solid transparent",
          }),
          background: "rgba(3, 194, 224, 0.2)",
          backdropFilter: "blur(0.9159rem)",
          cursor: "pointer",
          boxShadow: "inset 0 0 0 1px #03c2e0",
        },
      }}
    >
      <Text
        styleSheet={{
          fontWeight: "600",
          maxWidth: "80%",
          margin: {
            xs: "4px",
            sm: "4px",
            md: "8px",
          },
          fontSize: {
            xs: "8px",
            sm: "12px",
            md: "1vw",
            lg: "12px",
          },
        }}
      >
        {content.title}
      </Text>
    </Box>
  );
}
