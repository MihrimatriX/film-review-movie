"use client";

import { CELEBRITY_IMAGE_PLACEHOLDER } from "@/lib/celebrity-image";
import Image from "next/image";
import { useState } from "react";

type Props = {
  initialSrc: string;
  alt: string;
  sizes: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
};

/**
 * Falls back to placeholder when the URL is missing or the image fails to load.
 */
export function CelebrityPortraitImage({
  initialSrc,
  alt,
  sizes,
  fill,
  width,
  height,
  priority,
  className = "",
}: Props) {
  const [src, setSrc] = useState(
    initialSrc?.trim() ? initialSrc : CELEBRITY_IMAGE_PLACEHOLDER,
  );

  const onError = () => {
    if (src !== CELEBRITY_IMAGE_PLACEHOLDER)
      setSrc(CELEBRITY_IMAGE_PLACEHOLDER);
  };

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        priority={priority}
        onError={onError}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
      onError={onError}
    />
  );
}
