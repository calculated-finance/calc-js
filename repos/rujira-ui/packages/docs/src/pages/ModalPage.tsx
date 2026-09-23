import { Button, useGlobalModalContext } from "rujira.ui";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";

export const ModalPage = () => {
  const { showModal, hideModal } = useGlobalModalContext();

  const OpenModal = () => {
    showModal({
      title: "Hello World",
      backgroundClose: true,
      confirm: hideModal,
      children: <p>Modal content</p>,
    });
  };

  return (
    <>
      <h1 className="h1">Modal</h1>
      <h2 className="h2 color-grey">Usage</h2>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/context/GlobalModal.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/context/GlobalModal.tsx?ref_type=heads
        </a>
      </p>
      <p className="p mt-4">
        When working outside the <strong> Rujira monorepo</strong> include the
        global context in your main <code>App.tsx</code> file.
      </p>
      <Code
        language="ts"
        code={` // App.tsx
import { GlobalModal } from "rujira.ui";

function App() {
  return (
    <GlobalModal>
      ...
    </GlobalModal>
  );
}
  
// Page.tsx
import { useGlobalModalContext } from "rujira.ui";

export const Page = () => {
  const { showModal, hideModal } = useGlobalModalContext();

  const openModal = () => {
    showModal({
      title: "Hello World",
      backgroundClose: true,
      confirm: () => {
        ...
        hideModal();
      },
      children: <p>Modal content</p>,
    });
  };
};

`}
      />
      <Button className="mt-2" label="Launch Example" onClick={OpenModal} />
      <h3 className="h3 color-grey mt-6">Methods</h3>
      <table className="table mt-4">
        <thead className="border">
          <tr>
            <th>Method</th>
            <th>Parameters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>showModal</code>
            </td>
            <td>
              <code>ModalProps</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>hideModal</code>
            </td>
            <td>none</td>
          </tr>
        </tbody>
      </table>
      <h3 className="h3 color-grey mt-6">ModalProps</h3>
      <table className="table mt-4 table--big table--va-t table--lined">
        <thead className="border">
          <tr>
            <th>Attribute</th>
            <th>Description</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="color-primary1">title</td>
            <td>(optional) string</td>
            <td>null</td>
          </tr>
          <tr>
            <td className="color-primary1">confirm</td>
            <td>
              (optional) function
              <br />
              Will display the modal footer with <code>Cancel</code> and{" "}
              <code>Confirm</code> buttons. Will call this function on clicking
              confirm
            </td>
            <td>null</td>
          </tr>
          <tr>
            <td className="color-primary1">backgroundClose</td>
            <td>
              (optional) boolean
              <br />
              Close modal on clicking the background
            </td>
            <td>false</td>
          </tr>
          <tr>
            <td className="color-primary1">className</td>
            <td>(optional) string</td>
            <td>null</td>
          </tr>
        </tbody>
      </table>

      <h3 className="h3 color-grey mt-6">Optional Classes</h3>
      <table className="table mt-4 table--big table--va-t table--lined">
        <thead className="border">
          <tr>
            <th>Selector</th>
            <th>Corresponding Sass</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>modal--auto</code>
            </td>
            <td>
              <Code
                language="css"
                code={`.modal__window {
  width: auto;
}`}
              />
            </td>
          </tr>
          <tr>
            <td>
              <code>modal--large</code>
            </td>
            <td>
              <Code
                language="css"
                code={`.modal__window {
  width: 38rem;
}`}
              />
            </td>
          </tr>
          <tr>
            <td>
              <code>modal--nopad</code>
            </td>
            <td>
              <Code
                language="css"
                code={`.modal__window {
  padding: 0;
}`}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
