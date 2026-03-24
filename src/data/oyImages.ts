import oyAd1 from "@/assets/oy/oy-ad-1.png";
import oyAd2 from "@/assets/oy/oy-ad-2.png";
import oyAd3 from "@/assets/oy/oy-ad-3.png";
import oyAd4 from "@/assets/oy/oy-ad-4.avif";
import oyAd5 from "@/assets/oy/oy-ad-5.avif";
import oyAd6 from "@/assets/oy/oy-ad-6.avif";
import oyAd7 from "@/assets/oy/oy-ad-7.avif";
import oyAd8 from "@/assets/oy/oy-ad-8.avif";
import oyAd9 from "@/assets/oy/oy-ad-9.avif";
import oyAd10 from "@/assets/oy/oy-ad-10.avif";

export const oyAdImages = [
  oyAd1, oyAd2, oyAd3, oyAd4, oyAd5,
  oyAd6, oyAd7, oyAd8, oyAd9, oyAd10,
];

/** Get an Oy image by index, cycling through available images */
export function getOyImage(index: number): string {
  return oyAdImages[index % oyAdImages.length];
}
