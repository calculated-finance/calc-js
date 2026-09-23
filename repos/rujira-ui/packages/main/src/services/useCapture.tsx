import html2canvas from "html2canvas";
import { RefObject, useCallback } from "react";
import toast from "react-hot-toast";

const asBlob = (value: unknown): Blob | null =>
  value instanceof Blob ? value : null;

// Blocks until the element's box stops moving to ensure the image is generated at the correct size.
const waitForStableLayout = (el: HTMLElement, timeoutMs = 1000) =>
  new Promise<void>((resolve) => {
    const deadline = performance.now() + timeoutMs;
    let previous = -1;
    let steady = 0;

    const tick = () => {
      const { width } = el.getBoundingClientRect();
      steady = Math.abs(width - previous) < 0.5 ? steady + 1 : 0;
      previous = width;

      if (steady >= 3 || performance.now() > deadline) resolve();
      else requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });

export const useCapture = (
  ref: RefObject<HTMLElement>,
  shareData?: ShareData,
  scale: number = 1
) => {
  const capture = useCallback(async (): Promise<Blob | null> => {
    const el = ref.current;
    if (!el) return null;

    await document.fonts.ready;
    await waitForStableLayout(el);
    if (!ref.current) return null;

    const canvas = await html2canvas(ref.current, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      removeContainer: true,
    });

    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }, [ref, scale]);

  const share = async (source?: unknown) => {
    try {
      const blob = asBlob(source) ?? (await capture());
      if (!blob) return;

      const file = new File([blob], "screenshot.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ ...shareData, files: [file] });
      } else {
        toast.error("Your browser does not support file sharing");
      }
    } catch (err) {
      // Prevent an error looking toast message when the user explicitly aborts sharing.
      if ((err as DOMException)?.name === "AbortError") return;
      console.error(err);
      toast.error("Error sharing content");
    }
  };

  const copy = async (source?: unknown) => {
    try {
      const blob = asBlob(source) ?? (await capture());
      if (!blob) return;

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Clipboard write failed:", err);
      toast.error("Clipboard copy failed.");
    }
  };

  const download = async (filename = "rujira-share.png") => {
    try {
      const blob = await capture();
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Image downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Error downloading image");
    }
  };

  return { capture, share, copy, download };
};
