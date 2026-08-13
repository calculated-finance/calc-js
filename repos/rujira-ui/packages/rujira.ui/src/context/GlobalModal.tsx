import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { Button } from "../components/buttons/Button";
import { Xmark } from "../components/icons/Icons";
import { isEmpty } from "../helpers";
import { Tooltip } from "react-tooltip";
import { TranslationProvider, useTranslation } from "../i18n";

export type ModalProps = PropsWithChildren<{
  title?: string;
  confirm?: () => void;
  backgroundClose?: boolean;
  className?: string;
  hideCloseButton?: boolean;
}>;

type GlobalModalContext = {
  showModal: (modalProps: ModalProps) => void;
  hideModal: () => void;
};

const initialState: GlobalModalContext = {
  showModal: () => {},
  hideModal: () => {},
};

const GlobalModalContext = createContext(initialState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

const ModalContent: FC<{ modalProps: ModalProps; hideModal: () => void }> = ({
  modalProps,
  hideModal,
}) => {
  const { t } = useTranslation("common");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={clsx({
        modal: true,
        [`${modalProps.className}`]: modalProps.className,
      })}
      onClick={() => (modalProps.backgroundClose ? hideModal() : null)}>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="modal__window"
        onClick={(e) => {
          e.stopPropagation();
        }}>
        {modalProps.hideCloseButton !== true && (
          <button
            className="transparent modal__close fs-12 color-white fw-600 flex ai-c mr-1 mb-1 hover-primary1"
            onClick={hideModal}>
            <Xmark className="w-2 h-a mr-1" />
            {t("close")}
          </button>
        )}
        {modalProps.title && (
          <div className="modal__header">
            <h2>{modalProps.title}</h2>
          </div>
        )}
        {modalProps.children && modalProps.children}
        {modalProps.confirm && (
          <div className="modal__footer mt-4 px-3 py-2 text-right">
            <Button
              className="button--grey button--outline"
              onClick={hideModal}
              label={t("cancel")}
            />
            <Button
              className="button ml-1"
              onClick={modalProps.confirm}
              label={t("confirm")}
            />
          </div>
        )}
        <Tooltip id="modal-tip" className="tooltip" />
      </motion.div>
    </motion.div>
  );
};

export const GlobalModal: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modalProps, setModalProps] = useState<ModalProps>({});

  const showModal = (modalProps: ModalProps) => {
    document.body.style.overflow = "hidden";
    setModalProps(modalProps);
  };

  const hideModal = () => {
    document.body.style.overflow = "";
    setModalProps({});
  };

  const dest =
    typeof document !== "undefined" ? document.getElementById("modal") : null;

  const renderComponent = () => {
    return dest
      ? ReactDOM.createPortal(
          <TranslationProvider namespace="common">
            <AnimatePresence>
              {!isEmpty(modalProps) && (
                <ModalContent modalProps={modalProps} hideModal={hideModal} />
              )}
            </AnimatePresence>
          </TranslationProvider>,
          dest
        )
      : null;
  };

  return (
    <GlobalModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {renderComponent()}
    </GlobalModalContext.Provider>
  );
};
