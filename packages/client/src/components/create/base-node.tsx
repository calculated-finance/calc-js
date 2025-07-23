import { Handle, Position, useViewport } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useState, type ReactNode } from "react";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../../components/ui/modal";
import { useNodeModalStore } from "../../hooks/use-node-modal-store";
import { useNodeVisibilityStore } from "../../hooks/use-node-visibility";

export function BaseNode({
  id,
  handleLeft,
  handleRight,
  title,
  summary,
  details,
  modal,
  onDelete,
}: {
  id: string;
  handleLeft?: boolean;
  handleRight?: boolean;
  title: ReactNode;
  summary: ReactNode;
  details: ReactNode;
  modal: ReactNode;
  onDelete?: () => void;
}) {
  const { zoom } = useViewport();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { openId, setOpenId } = useNodeModalStore();

  const { isVisible } = useNodeVisibilityStore();

  const getContentType = (zoomLevel: number) => {
    if (zoomLevel < 0.6) return "title";
    if (zoomLevel < 1.2) return "summary";
    return "details";
  };

  const currentContentType = getContentType(zoom);
  const [displayedContentType, setDisplayedContentType] = useState(currentContentType);

  useEffect(() => {
    if (currentContentType !== displayedContentType) {
      setIsTransitioning(true);

      const fadeOutTimer = setTimeout(() => {
        setDisplayedContentType(currentContentType);
        setIsTransitioning(false);
      }, 110);

      return () => clearTimeout(fadeOutTimer);
    }
  }, [currentContentType, displayedContentType]);

  return (
    <div>
      <div
        className={`flex h-[150px] w-[200px] cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-black p-4 text-center shadow transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        } `}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          setOpenId(id);
        }}
      >
        {onDelete && (
          <div
            className={`absolute top-1 right-[10px] transition-opacity ${getContentType(zoom) === "title" ? "opacity-0" : "opacity-100"}`}
          >
            <code className="cursor-pointer text-xs text-zinc-500 hover:underline" onClick={onDelete}>
              delete
            </code>
          </div>
        )}
        {handleLeft && <Handle type="target" position={Position.Left} />}
        <div className={`transition-opacity duration-300 ease-in-out ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
          {
            {
              title,
              summary,
              details,
            }[displayedContentType]
          }
        </div>
        {handleRight && <Handle type="source" position={Position.Right} />}
      </div>
      <Modal
        open={!!id && id == openId}
        onOpenChange={(open) => {
          if (!open) setOpenId(null);
        }}
      >
        <ModalContent
          className="h-fit w-fit overflow-auto rounded-xl border bg-black p-10"
          drawerProps={{
            className: "px-6 pt-2 pb-10 border-none",
          }}
          dialogProps={{
            showCloseButton: false,
          }}
        >
          <ModalHeader className="hidden">
            <ModalTitle>title</ModalTitle>
          </ModalHeader>
          {modal}
        </ModalContent>
      </Modal>
    </div>
  );
}
