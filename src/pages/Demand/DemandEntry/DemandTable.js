import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Table } from "antd";

import { StoreContext } from "../../../index";

const DemandTable = observer(() => {
  const { demandStore } = useContext(StoreContext);

  useEffect(() => {
    demandStore.fetchRevisions();
    demandStore.fetchDemand(false, demandStore.selectedRevision);
  }, [demandStore]);

  console.debug(`rendered demand aggregation '${demandStore.demandAgg}'`);

  return (
    <Table
      columns={demandStore.demandTableColumnsMeta}
      dataSource={
        demandStore.demandTableData
          ? demandStore.demandTableData[demandStore.demandAgg]
          : null
      }
      pagination={{ pageSize: 18 }}
      size="small"
    />
  );
});

export default DemandTable;
