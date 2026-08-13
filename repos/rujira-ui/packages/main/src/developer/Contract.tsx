import { Buffer } from "buffer";
import { FC, Suspense, useState } from "react";
import {
  PreloadedQuery,
  useLazyLoadQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { useParams } from "react-router-dom";
import { graphql } from "relay-runtime";
import { Button, Loader, Textarea, Warning } from "rujira.ui";

import { Icons } from "rujira.ui";
import { NotFound } from "../common/NotFound";
import { NoIndexHelmet } from "../seo";
import { ContractInfoQuery } from "./__generated__/ContractInfoQuery.graphql";
import {
  ContractSmartQuery,
  ContractSmartQuery$data,
} from "./__generated__/ContractSmartQuery.graphql";

const queryInfo = graphql`
  query ContractInfoQuery($id: ID!) {
    node(id: $id) {
      ... on Contract {
        info {
          admin
          codeId
          code {
            checksum
          }
          creator
          label
        }
        config
      }
    }
  }
`;

const querySmart = graphql`
  query ContractSmartQuery($id: ID!, $query: String!) {
    node(id: $id) @catch {
      ... on Contract {
        querySmart(query: $query)
      }
    }
  }
`;

export const ContractPage: FC = () => {
  const { address } = useParams<{ address: string }>();
  return address ? <Contract address={address} /> : <NotFound />;
};

export const Contract: FC<{ address: string }> = ({ address }) => {
  const id = Buffer.from(`Contract:${address}`).toString("base64");
  const info = useLazyLoadQuery<ContractInfoQuery>(queryInfo, { id });
  return (
    <>
      <NoIndexHelmet>
        <title>Rujira Contract</title>
      </NoIndexHelmet>
      <div className="rujira__main rujira__main--gradient pools">
        <div className="rujira__inner--pad">
          <div className="rujira__inner">
            <h1 className="h1 mb-0">Contract</h1>
            <p className="color-grey ml-2">{info.node?.info?.label}</p>
            <div className="row wrap pad mt-2">
              <div className="col-12 col-md-6">
                <div className="card p-2">
                  <p className="color-grey">admin</p>
                  <p className="mb-1">{info.node?.info?.admin || "None"}</p>
                  <p className="color-grey">creator</p>
                  <p className="mb-1">{info.node?.info?.creator || "None"}</p>
                  <p className="color-grey">code ID</p>
                  <p className="mb-1">{info.node?.info?.codeId || "None"}</p>
                  <p className="color-grey">code checksum</p>
                  <p className="mb-1 breakall">
                    {info.node?.info?.code.checksum || "None"}
                  </p>

                  {info.node?.config && (
                    <>
                      <p className="color-grey mb-1">config</p>
                      <pre className="breakall">
                        {JSON.stringify(JSON.parse(info.node.config), null, 2)}
                      </pre>
                    </>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6">
                <Query id={id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const Query: FC<{ id: string; cancel?: () => void }> = ({
  id,
  cancel,
}) => {
  const [query, setQuery] = useState(JSON.stringify({ config: {} }));
  const [q, load] = useQueryLoader<ContractSmartQuery>(querySmart);
  const submit = () => load({ id, query });
  return (
    <div className="card p-2">
      <Textarea
        value={query}
        onChange={(x) => setQuery(x.currentTarget.value)}
        cols={20}
      />
      <Suspense fallback={<Loader className="w-4 h-4" />}>
        {q ? <QueryResponse q={q} /> : null}
      </Suspense>
      <div className="flex flex-col jc-e mt-2 ">
        {cancel ? (
          <Button
            className="button--outline mr-1"
            onClick={cancel}
            label="Close"
          />
        ) : null}
        <Button label="Query" onClick={submit} />
      </div>
    </div>
  );
};

const QueryResponse: FC<{ q: PreloadedQuery<ContractSmartQuery> }> = ({
  q,
}) => {
  const response = usePreloadedQuery<ContractSmartQuery>(querySmart, q);

  return response.node.ok ? (
    <QueryResponseOk value={response.node.value} />
  ) : (
    <QueryResponseErr errors={response.node.errors} />
  );
};

const QueryResponseOk: FC<{
  value: Extract<ContractSmartQuery$data["node"], { ok: true }>["value"];
}> = ({ value }) => {
  return (
    <pre className="breakall mt-2">
      {JSON.stringify(
        value?.querySmart ? JSON.parse(value.querySmart) : null,
        null,
        2
      )}
    </pre>
  );
};

const QueryResponseErr: FC<{
  errors: Extract<ContractSmartQuery$data["node"], { ok: false }>["errors"];
}> = ({ errors }) => {
  return (
    <>
      {errors.map((e, idx) =>
        e &&
        typeof e === "object" &&
        "status" in e &&
        typeof e.status === "string" ? (
          <Warning key={idx} color="red" className="condensed mt-2">
            <Icons.ExclamationTriangle className="color-red" />
            <span className="warning__msg">{e.status}</span>
          </Warning>
        ) : null
      )}
    </>
  );
};
