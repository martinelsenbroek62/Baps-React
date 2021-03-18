import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Collapse,
  Button,
  Timeline,
  Row,
  Col,
  Card,
  Radio,
  Drawer,
} from "antd";

import { StoreContext } from "../../../index";
import { downloadFile } from "../../../utils/uploadDownload";

import DemandTable from "./DemandTable";
import DemandUploadForm from "./DemandUploadForm";
import { DemandChart } from "./DemandChart";

const { Panel } = Collapse;

const DemandEntry = observer(() => {
  const { demandStore } = useContext(StoreContext);
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <div>
      <Drawer
        title="Upload Revision"
        placement="right"
        closable={true}
        onClose={() => setDrawerVisible(false)}
        width={500}
        visible={drawerVisible}
      >
        <DemandUploadForm />
      </Drawer>
      <Row>
        <Col span={18}>
          <span>Quick Aggregate: </span>
          <Button
            type={demandStore.demandAgg === "monthly" ? "primary" : "default"}
            style={{ margin: 5, width: 100 }}
            onClick={() => demandStore.setDemandAgg("monthly")}
          >
            Monthly
          </Button>
          <Button
            type={demandStore.demandAgg === "quarterly" ? "primary" : "default"}
            style={{ margin: 5, width: 100 }}
            onClick={() => demandStore.setDemandAgg("quarterly")}
          >
            Quarterly
          </Button>
          <Button
            type={demandStore.demandAgg === "yearly" ? "primary" : "default"}
            style={{ margin: 5, width: 100 }}
            onClick={() => demandStore.setDemandAgg("yearly")}
          >
            Yearly
          </Button>
          <Collapse>
            <Panel header="Demand Chart">
              <DemandChart />
            </Panel>
          </Collapse>
          <DemandTable />
        </Col>
        <Col span={6}>
          <Card
            bodyStyle={{
              padding: "10px 0 10px 0",
              textAlign: "left",
              margin: "0 0 0 20px",
            }}
            className="demand-card"
            headStyle={{ background: "#fafafa" }}
            title="Revision History"
          >
            <Button
              onClick={() =>
                downloadFile(
                  `/demand/download?revision=${demandStore.selectedRevision}`
                )
              }
              style={{ width: "95%", marginBottom: 10 }}
            >
              Download Revision
            </Button>
            <Button
              onClick={() => setDrawerVisible(true)}
              style={{ width: "95%", marginBottom: 10 }}
            >
              Upload Revision
            </Button>
            {/* </a> */}
            <Radio.Group
              onChange={(e) => demandStore.setSelectedRevision(e.target.value)}
              value={demandStore.selectedRevision}
            >
              <Timeline className="demand-timeline" reverse={true}>
                {demandStore.demandRevisions.map((rev) => {
                  return (
                    <Timeline.Item color="gray" key={rev.id}>
                      {rev.name}
                      <Radio
                        className="demand-timeline-radio"
                        key={rev.id}
                        value={rev.id}
                      ></Radio>
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            </Radio.Group>
          </Card>
        </Col>
      </Row>
    </div>
  );
});

export default DemandEntry;
