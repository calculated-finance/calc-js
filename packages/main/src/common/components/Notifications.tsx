import { Button, Checkbox, useTranslation, TranslationProvider, useGlobalModalContext } from "rujira.ui";
import { useNotifications } from "../../services/notifcation";
import notification from "../assets/notification.gif";

export const NotificationModal = ({ hideModal }: { hideModal: () => void }) => {
  const { t } = useTranslation("common");
  const { dontShow, setDontShow, requestPermission } = useNotifications();

  return (
    <>
      <img
        src={notification}
        alt=""
        className="filter-orange block w-6 h-a mb-2"
      />
      <div className="modal__header">
        <h2>{t("enablePushNotifications")}</h2>
      </div>
      <p className="lh-19">
        {t("notificationDescription")}
      </p>
      <Checkbox
        id="hidemsg"
        className="mt-4"
        label={t("dontAskAgain")}
        checked={dontShow}
        onChange={() => setDontShow(!dontShow)}
      />
      <div className="modal__footer mt-4 px-3 py-2 flex ai-s wrap">
        <Button
          className="button--grey button--outline mr-1"
          onClick={() => hideModal()}
          label={t("cancel")}
        />
        <div className="block ml-a text-right">
          <Button
            className="ml-a"
            label={t("enableNotifications")}
            onClick={() => {
              requestPermission().then(hideModal);
            }}
          />
        </div>
      </div>
    </>
  );
};

export const useNotificationModal = () => {
  const { showModal, hideModal } = useGlobalModalContext();
  const { dontShow } = useNotifications();

  const request = () => {
    if (Notification.permission === "default" && !dontShow) {
      showModal({
        //title: "Important Information",
        backgroundClose: true,
        children: (
          <TranslationProvider namespace="common">
            <NotificationModal hideModal={hideModal} />
          </TranslationProvider>
        ),
      });
    }
  };
  return { request };
};
