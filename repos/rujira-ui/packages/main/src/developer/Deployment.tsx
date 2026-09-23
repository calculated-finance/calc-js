import { Buffer } from "buffer";
import { FC, useEffect } from "react";
import { PreloadedQuery, usePreloadedQuery, useQueryLoader } from "react-relay";
import { graphql } from "relay-runtime";
import { Button, Icons, useGlobalModalContext } from "rujira.ui";
import { NoIndexHelmet } from "../seo";
import { DeploymentQuery } from "./__generated__/DeploymentQuery.graphql";
import { Query } from "./Contract";

const query = graphql`
  query DeploymentQuery {
    deployment {
      targets {
        address
        module
        name
        contract {
          codeId
          code {
            checksum
          }
          admin
          label
        }
        version
      }
    }
  }
`;

export const Deployment: FC = () => {
  const [q, load] = useQueryLoader<DeploymentQuery>(query);
  useEffect(() => {
    load({});
  }, []);
  return (
    <>
      <NoIndexHelmet>
        <title>Rujira Deployment</title>
      </NoIndexHelmet>
      <div className="rujira__main rujira__main--gradient pools">
        <div className="rujira__inner--pad">
          <div className="rujira__inner">
            <h1 className="h1">Deployment</h1>
            <div className="relative card p-3 mt-2 table-sticky">
              {q ? <Content q={q} /> : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Content: FC<{ q: PreloadedQuery<DeploymentQuery> }> = ({ q }) => {
  const data = usePreloadedQuery(query, q);
  return (
    <table className="table table--big condensed nowrap">
      <thead>
        <tr>
          <th />
          <th>Target Protocol</th>
          <th>Contract Name</th>
          <th>Contract Version</th>
          <th>Contract Label</th>
          <th>Code ID</th>
          <th>Checksum</th>
          <th>Admin</th>
          <th>Address</th>
        </tr>
      </thead>
      {data.deployment ? (
        <tbody>
          {[...data.deployment.targets]
            .filter((a) => !!a.contract)
            .sort(
              (a, b) =>
                a.name.localeCompare(b.name) ||
                (a.contract?.label
                  ? b.contract?.label
                    ? a.contract?.label.localeCompare(b.contract?.label)
                    : 0
                  : 0)
            )
            .map((a) => (a ? <Item key={a.address} item={a} /> : null))}
        </tbody>
      ) : null}
    </table>
  );
};

const Item: FC<{
  item: NonNullable<
    NonNullable<DeploymentQuery["response"]["deployment"]>["targets"][number]
  >;
}> = ({ item }) => {
  const { showModal, hideModal } = useGlobalModalContext();
  const id = Buffer.from(`Contract:${item.address}`).toString("base64");

  const open = () => {
    showModal({
      title: "Query Contract",
      children: <Query id={id} cancel={hideModal} />,
    });
  };
  return (
    <tr>
      <td>
        <Button onClick={open} className="button--xs">
          <Icons.Eye />
        </Button>
      </td>
      <td>{item.name}</td>
      <td>{item.version}</td>
      <td>{item.contract?.label}</td>
      <td>{item.contract?.codeId}</td>
      <td>{item.contract?.code.checksum}</td>
      <td>{item.contract?.admin}</td>
      <td>{item.address}</td>
    </tr>
  );
};
