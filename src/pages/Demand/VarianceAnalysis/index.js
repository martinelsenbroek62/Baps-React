import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Select } from "antd";

import { StoreContext } from "../../../index";

const { Option } = Select;

// const onRunAnalysisClick = () => {
//     fetch("/variance?rev1=<id1>&rev2=<id2>")
// }

const VarianceAnalysis = observer(() => {
  const { demandStore } = useContext(StoreContext);

  useEffect(() => {
    demandStore.fetchRevisions();
    console.log(demandStore.demandRevisions);
  }, [demandStore]);

  return (
    <div>
      <Select style={{ width: 320 }}>
        {demandStore.demandRevisions
          .slice()
          .sort((a, b) => b.id - a.id)
          .map((item) => {
            return <Option key={item.id}>{item.name}</Option>;
          })}
      </Select>
      <Select style={{ width: 320 }}>
        {demandStore.demandRevisions
          .slice()
          .sort((a, b) => b.id - a.id)
          .map((item) => {
            return <Option key={item.id}>{item.name}</Option>;
          })}
      </Select>
      <Button type="primary">Run Analysis</Button>
    </div>
  );
});

export default VarianceAnalysis;
