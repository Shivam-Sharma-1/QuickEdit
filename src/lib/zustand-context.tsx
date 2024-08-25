import { createContext, useContext, useState } from "react";
import { StoreApi } from "zustand";

export const createZustandContext = <TInitial, TStore extends StoreApi<any>>(
  getStore: (initial: TInitial) => TStore
) => {
  const Context = createContext(null as any as TStore);
  const Provider = (props: {
    children?: React.ReactNode;
    initialValue: TInitial;
  }) => {
    const [store] = useState(getStore(props.initialValue));
    return <Context.Provider value={store}>{props.children}</Context.Provider>;
  };

  return {
    useContext: () => useContext(Context),
    Context,
    Provider,
  };
};
