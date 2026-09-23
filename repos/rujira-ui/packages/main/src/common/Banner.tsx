import { Button, Icons } from "rujira.ui";
import exclamation from "rujira.ui/assets/images/exclamation.gif";

const BANNER_VERSION = "thorchain-halt-v1";
const BANNER_MUTE_EXPIRES = true;
const BANNER_MUTE_MS = 24 * 60 * 60 * 1000; // re-show after 24 h
const STORAGE_KEY = "rujira-banner";

type BannerRecord = {
  version: string;
  mutedAt: number;
};

export const ShowBanner = false;

export const shouldShowBanner = (): boolean => {
  if (!ShowBanner) return false;
  try {
    const lsData = localStorage.getItem(STORAGE_KEY);
    if (!lsData) return true;
    const record: BannerRecord = JSON.parse(lsData);
    if (record.version !== BANNER_VERSION) return true;
    if (!BANNER_MUTE_EXPIRES) return false;
    return record?.mutedAt ? Date.now() - record.mutedAt >= BANNER_MUTE_MS : true;
  } catch {
    return true;
  }
};

const dismissBanner = () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: BANNER_VERSION, mutedAt: Date.now() })
  );
};

export const BannerContent = ({ close }: { close: () => void }) => {
  const handleMute = () => {
    dismissBanner();
    close();
  };

  return (
    <>
      <img
        src={exclamation}
        alt=""
        className="filter-orange block no-shrink w-6 h-6 mb-1"
      />
      <p className="p">
        THORChain is halted, and withdrawals and deposits of Secured Assets are
        currently not possible.
        <br />
        <a
          href="https://x.com/RujiraNetwork/status/2055624010495611187"
          target="_blank"
          rel="noopener noreferrer"
          className="color-white hover-primary1">
          Read the official post here
        </a>
        .
      </p>
      <p className="p flex ai-c gap-0.5">
        Follow us for the latest updates:
        <a
          href="https://t.me/Rujira_Community"
          target="_blank"
          rel="noopener noreferrer"
          className="color-grey hover-primary1 iflex ai-b no-underline ml-1">
          <Icons.Telegram className="w-3 h-3 block" />
        </a>
        <a
          href="https://x.com/RujiraNetwork"
          target="_blank"
          rel="noopener noreferrer"
          className="color-grey hover-primary1">
          <Icons.X className="w-3 h-3 block" />
        </a>
      </p>
      <div className="modal__footer p-2 flex ai-c gap-1">
        <Button
          variant="primary"
          className="w-full"
          onClick={close}
          label="Okay"
        />
        <Button
          label="Mute This Message"
          onClick={handleMute}
          className={"w-full button--outline"}
        />
      </div>
    </>
  );
};

/*
Post: https://x.com/RujiraNetwork/status/2055624010495611187
TG: https://t.me/Rujira_Community
X: https://x.com/RujiraNetwork
*/
