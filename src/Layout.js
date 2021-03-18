import React, { useContext } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { StoreContext } from "./index";
import { observer } from "mobx-react-lite";
import { Layout, Menu, Button, Popover, Select, Space, Typography } from "antd";
import {
  LaptopOutlined,
  PictureOutlined,
  ProjectOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import logo from "./assets/logo-myra.png";

import DemandEntry from "./pages/Demand/DemandEntry";
import VarianceAnalysis from "./pages/Demand/VarianceAnalysis";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Text } = Typography;
const { Option } = Select;

const skus = [
  { value: "embrel.1", text: "embrel.1" },
  { value: "embrel.2", text: "embrel.2" },
];

const text = <span>Select Active Products</span>;
const SkuSelect = observer(({ store }) => {
  return (
    <div style={{ width: 500 }}>
      <Text style={{ float: "left", paddingLeft: "10px" }} type="secondary">
        SKU
      </Text>
      <Select
        style={{ margin: "5px", paddingBottom: "30 px", width: "95%" }}
        mode="multiple"
        onChange={(value) => store.setSelectedSkus(value)}
      >
        {skus.map((item, idx) => (
          <Option key={idx} value={item.value}>
            {item.text}
          </Option>
        ))}
      </Select>
    </div>
  );
});

// Just show the latest item.
function displayRender(label) {
  return label[label.length - 1];
}

const AppLayout = observer(() => {
  const rootStore = useContext(StoreContext);
  const { demandStore } = rootStore;

  return (
    <Layout>
      <Header>
        <div style={{ float: "left" }}>
          <Space size="middle">
            <img src={logo} alt="Myra EB Logo" />
            <h3 style={{ color: "#1890ff" }}>
              BIOPHARMA ASSET PLANNING SOFTWARE
            </h3>
          </Space>
        </div>
        <div style={{ float: "right" }}>
          <Menu theme="dark" mode="horizontal">
            <SubMenu icon={<UserOutlined />} title="Account">
              <Menu.Item icon={<SettingOutlined />} key="30">
                Settings
              </Menu.Item>
              <Menu.Item icon={<LogoutOutlined />} key="31">
                Logout
              </Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      </Header>
      <Layout>
        <Sider theme="light" width={200} className="site-layout-background">
          <Popover
            placement="right"
            title={text}
            content={<SkuSelect store={demandStore} />}
            trigger="click"
          >
            <Button
              style={{
                marginTop: "10px",
                width: "95%",
                fontWeight: demandStore.selectedSkus.length ? "bold" : "",
              }}
              onClick={() => (rootStore.productStore.test = "GONE!")}
            >
              {demandStore.selectedSkus.length
                ? "SKUs Selected"
                : "Select SKUs"}
            </Button>
          </Popover>
          <Menu
            mode="inline"
            defaultSelectedKeys={["10"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <Menu.Item icon={<PictureOutlined />} key="1">
              Dashboard
            </Menu.Item>
            <SubMenu key="sub1" icon={<LaptopOutlined />} title="Demand">
              <Menu.Item key="10">
                <Link to="/demand">Demand Entry</Link>
              </Menu.Item>
              <Menu.Item key="11">
                <Link to="/variance">Variance Analysis</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<ProjectOutlined />} title="Production">
              <Menu.Item key="20">Inventory</Menu.Item>
              <Menu.Item key="21">Production Plan</Menu.Item>
              <Menu.Item key="22">E&O Report</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 1080,
            }}
          >
            <Switch>
              <Route path="/variance">
                <VarianceAnalysis />
              </Route>
              <Route path={["/", "/demand"]}>
                <DemandEntry />
              </Route>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
});

export default AppLayout;
