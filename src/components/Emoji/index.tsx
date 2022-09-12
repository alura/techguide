import React from "react";
import Image from "../Image";

const emojis = {
  fire: {
    src: "fire",
    alt: "🔥",
  },
  star: {
    src: "star",
    alt: "⭐",
  },
} as const;

interface EmojiProps {
  name: keyof typeof emojis;
}
export default function Emoji({ name }: EmojiProps) {
  return (
    <Image
      src={`/assets/emoji/${emojis[name].src}.png`}
      alt={`${emojis[name].alt}`}
      styleSheet={{ width: "1.8ch", height: "1.8ch", alignSelf: "center" }}
    />
  );
}
