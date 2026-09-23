import { Code } from "../components/Code";
import { useState } from "react";
import { Button, Textarea, Icons } from "rujira.ui";
import { Copy } from "../components/Copy";
import { GitLabIcon } from "../components/GitLabIcon";

export const Cards = () => {
  const [classes, setClasses] = useState("card p-3");
  return (
    <>
      <h1 className="h1">Cards</h1>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500">
        <GitLabIcon className="w-a h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/styledcomponents/_card.scss?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/styledcomponents/_card.scss?ref_type=heads
        </a>
      </p>
      <h2 className="h2 color-grey mt-4 mb-2">Solid Card</h2>
      <p className="p">
        The selector class for a card is <Copy text="card" />.
      </p>
      <div className="row wrap mt-2 example example--with-controls">
        <div className="col-12 col-lg-6 flex ai-c jc-c bg-primary5 p-4">
          <div className={classes}>
            <h3 className="fs-16 lh-22 fw-400 color-grey">Wallet Value</h3>
            <div className="decimal decimal--label-left fs-36 condensed fw-500 color-white">
              <span className="decimal__int">243,751.</span>
              <span className="decimal__dec">43</span>
              <span className="decimal__label">~$</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 p-3 example__controls">
          <Textarea
            value={classes}
            onChange={(e) => setClasses(e.currentTarget.value)}
            label="Classes"
          />
        </div>
        <div className="col-12">
          <Code
            language="tsx"
            code={`import "rujira.ui/scss/index.scss";
import { Decimal } from "rujira.ui";

<div
  className="${classes}"
>
  <h3 class="fs-16 lh-22 fw-400 color-grey">Wallet Value</h3>
  <Decimal
    labelLeft
    label="~$"
    amount={totalUSD}
    round={2}
    decimals={0}
    className="fs-36 condensed fw-500"
  />
</div>`}
          />
        </div>
      </div>
      <h3 className="h3 color-grey mt-4 mb-2">Modifiers</h3>
      <p className="p">
        Modifier selectors should be used along with the main selector, e.g.{" "}
        <Copy text="card card--shadow" />.
      </p>
      <table className="table table--no-hover table--big mt-4 table--big">
        <thead className="border">
          <tr>
            <th>Modifier Selector</th>
            <th>Preview / Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Copy text="card--shadow" />
            </td>
            <td style={{ backgroundColor: "#ECEFF1" }}>
              <div className="card card--shadow w-20 h-10" />
            </td>
          </tr>
          <tr>
            <td>
              <Copy text="card--semi-transparent" />
            </td>
            <td style={{ backgroundColor: "#ECEFF1" }}>
              <div className="card card--semi-transparent w-20 h-10" />
            </td>
          </tr>
          <tr>
            <td>
              <Copy text="card--very-transparent" />
            </td>
            <td style={{ backgroundColor: "#ECEFF1" }}>
              <div className="card card--very-transparent w-20 h-10" />
            </td>
          </tr>
          <tr>
            <td>
              <Copy text="card--blur" />
            </td>
            <td style={{ backgroundColor: "#ECEFF1" }}>
              <div className="card card--blur w-20 h-10" />
            </td>
          </tr>
          <tr>
            <td>
              <Copy text="card--border" />
            </td>
            <td style={{ backgroundColor: "#263238" }}>
              <div className="card card--border w-20 h-10" />
            </td>
          </tr>
          <tr>
            <td>
              <Copy text="card--border-solid" />
            </td>
            <td style={{ backgroundColor: "#263238" }}>
              <div className="card card--border-solid w-20 h-10" />
            </td>
          </tr>
          <tr>
            <td>
              <Copy text="card--hover-border" />
            </td>
            <td style={{ backgroundColor: "#263238" }}>
              <div className="card card--hover-border w-20 h-10" />
            </td>
          </tr>
          <tr>
            <td>
              <Copy text="card--transparent" />
            </td>
            <td>
              <Code language="css" code={`background: transparent;`} />
            </td>
          </tr>
          <tr>
            <td>
              <Copy text="card--hide-overflow" />
            </td>
            <td>
              <Code language="css" code={`overflow: hidden;`} />
            </td>
          </tr>
          <tr>
            <td>
              <Copy text="card--h-full" />
            </td>
            <td>
              <Code language="css" code={`height: 100%;`} />
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="h2 color-grey mt-6 mb-2">Gradient Card</h2>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500">
        <GitLabIcon className="w-a h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/styledcomponents/_card.scss?ref_type=heads#L82-130"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/styledcomponents/_card.scss?ref_type=heads#L82-130
        </a>
      </p>
      <p className="p mt-4">
        The selector class for a gradient card is <Copy text="gradient-card" />.
      </p>
      <p className="p">
        It is important to set a background color for the card, e.g.{" "}
        <Copy text="bg-black" />
      </p>
      <p className="p">
        The parent of the <code>gradient-card</code> element should have{" "}
        <code>position: relative | absolute</code> and a <code>z-index</code>{" "}
        sey. A helper class is provided with{" "}
        <Copy text="gradient-card-container" />
      </p>

      <div className="row wrap mt-2 example example--with-controls">
        <div className="col-12 flex ai-c jc-c bg-primary5 p-4 gradient-card-container">
          <div className="gradient-card gradient-card--purple p-3 bg-black">
            <div className="flex ai-c">
              <div className="mr-2">
                <h3 className="fs-16 lh-22 fw-500 color-primary1">
                  Buy Crypto
                </h3>
                <p className="fs-14 color-white mt-q1">
                  Let's get started by purchasing some crypto
                </p>
              </div>
              <Button className="ml-a button--icon-right no-shrink">
                <span>Buy Now</span>
                <Icons.AngleRight />
              </Button>
            </div>
          </div>
        </div>
        <div className="col-12">
          <Code
            language="tsx"
            code={`import "rujira.ui/scss/index.scss";
import { Button, Icons } from "rujira.ui";

<div className="gradient-card gradient-card--purple p-3 bg-black">
  <div className="flex ai-c">
    <div className="mr-2">
      <h3 className="fs-16 lh-22 fw-500 color-primary1">
        Buy Crypto
      </h3>
      <p className="fs-14 color-white mt-q1">
        Let's get started by purchasing some crypto
      </p>
    </div>
    <Button className="ml-a button--icon-right no-shrink">
      <span>Buy Now</span>
      <Icons.AngleRight />
    </Button>
  </div>
</div>`}
          />
        </div>
      </div>

      <h3 className="h3 color-grey mt-4 mb-2">Modifiers</h3>
      <p className="p">
        Modifier selectors should be used along with the main selector, e.g.{" "}
        <Copy text="gradient-card gradient-card--purple" />.
      </p>

      <table className="table table--no-hover table--big mt-4 table--big">
        <thead className="border">
          <tr>
            <th>Modifier Selector</th>
            <th>Preview / Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>.gradient-card</code>
            </td>
            <td
              style={{
                backgroundColor: "#22242f",
                position: "relative",
                zIndex: 1,
              }}>
              <div className="bg-black gradient-card w-20 p-3 color-white">
                <p>Hello</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <code>.gradient-card--purple</code>
            </td>
            <td
              style={{
                backgroundColor: "#22242f",
                position: "relative",
                zIndex: 1,
              }}>
              <div className="bg-black gradient-card gradient-card--purple p-3 w-20 color-white">
                <p>Hello</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <code>.gradient-card--blue</code>
            </td>
            <td
              style={{
                backgroundColor: "#22242f",
                position: "relative",
                zIndex: 1,
              }}>
              <div className="bg-black gradient-card gradient-card--blue p-3 w-20 color-white">
                <p>Hello</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <hr className="hr mt-5 mb-4" />
    </>
  );
};
