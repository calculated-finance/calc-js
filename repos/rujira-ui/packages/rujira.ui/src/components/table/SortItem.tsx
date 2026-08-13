import { createContext, FC, PropsWithChildren, useContext } from "react";
import { useQueryParam } from "../../hooks/useQueryParam";
import { Sort, SortDown, SortUp } from "../icons/Icons";

export enum SortDir {
  Asc = "ASC",
  Desc = "DESC",
}

type SortContextI<SortBy> = [
  { sortBy: SortBy; sortDir: SortDir },
  { setSortBy: (value: SortBy) => void; setSortDir: (dir: SortDir) => void },
];

export const createSortContext = <SortBy extends string>(
  by: SortBy,
  dir?: SortDir
) => {
  const context = createContext<SortContextI<SortBy>>([
    {
      sortBy: by,
      sortDir: SortDir.Asc,
    },
    {
      setSortBy: function (): void {
        throw new Error("Function not implemented.");
      },
      setSortDir: function (): void {
        throw new Error("Function not implemented.");
      },
    },
  ]);

  const useValues = () => {
    const [x] = useContext(context);
    return x;
  };

  const Provider: FC<PropsWithChildren> = ({ children }) => {
    const [sortBy, setSortBy] = useQueryParam<SortBy>("sortBy", by);
    const [sortDir, setSortDir] = useQueryParam("sortDir", dir || SortDir.Asc);

    return (
      <context.Provider
        value={[
          {
            sortBy,
            sortDir,
          },
          { setSortBy, setSortDir },
        ]}>
        {children}
      </context.Provider>
    );
  };

  const Item = ({
    className,
    label,
    value,
  }: {
    label: string;
    value: SortBy;
    className?: string;
  }) => {
    const [{ sortBy, sortDir }, { setSortBy, setSortDir }] =
      useContext(context);
    return (
      <th>
        <div
          className={`flex ai-c no-select pointer ${className || ""}`}
          onClick={() => {
            setSortDir(sortDir === SortDir.Asc ? SortDir.Desc : SortDir.Asc);
            sortBy !== value && setSortBy(value);
          }}>
          {label}
          {sortBy === value && sortDir === SortDir.Desc && (
            <SortDown className="color-white ml-0.5 w-2 h-a" />
          )}
          {sortBy === value && sortDir === SortDir.Asc && (
            <SortUp className="color-white ml-0.5 w-2 h-a" />
          )}
          {sortBy !== value && <Sort className="color-grey ml-0.5 w-2 h-a" />}
        </div>
      </th>
    );
  };

  return { Provider, Item, useValues };
};
