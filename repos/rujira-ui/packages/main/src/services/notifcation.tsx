import { createContext, FC, PropsWithChildren, useContext } from "react";
import { useLocalStorage } from "rujira.ui";

const supported = "Notification" in window;

const context = createContext<{
  dontShow: boolean;
  setDontShow: (v: boolean) => void;
  requestPermission: () => Promise<NotificationPermission>;
  push: (title: string, options?: NotificationOptions) => Notification | null;
}>({
  dontShow: false,
  setDontShow: () => {},
  requestPermission: async () => "denied",
  push: () => null,
});

export const NotificationContext: FC<PropsWithChildren> = ({ children }) => {
  const [dontShow, setDontShow] = useLocalStorage<boolean>(
    "rujira-push-dontshow",
    false
  );

  return (
    <context.Provider
      value={{
        dontShow,
        setDontShow,
        requestPermission: async () =>
          supported ? Notification.requestPermission() : "denied",
        push: (title: string, options?: NotificationOptions) =>
          supported ? new Notification(title, options) : null,
      }}>
      {children}
    </context.Provider>
  );
};

export const useNotifications = () => useContext(context);
