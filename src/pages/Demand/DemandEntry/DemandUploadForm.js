import React, { useContext, useState } from "react";
import { Button, Input, message, Upload, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { StoreContext } from "../../../index";

const { Text } = Typography;
const { TextArea } = Input;

const DemandUploadForm = () => {
  const { demandStore } = useContext(StoreContext);
  const [description, setDescription] = useState("");

  const onUploadChangeHandler = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      console.log("upload response", info.file.response);
      setDescription("");
      demandStore.fetchRevisions();
      demandStore.fetchDemand(false, demandStore.selectedRevision);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div>
      {!description.length ? (
        <Text type="danger">*Description Required</Text>
      ) : (
        <div style={{ height: 22 }} />
      )}
      <TextArea
        allowClear={true}
        onChange={(e) => setDescription(e.nativeEvent.target.value)}
        placeholder="Describe reason for changes ..."
        rows={20}
        style={{ marginBottom: 20 }}
        value={description}
      />
      <Upload
        accept=".csv"
        action="/demand/upload"
        data={{
          description: description,
        }}
        showUploadList={false}
        onChange={onUploadChangeHandler}
      >
        <Button disabled={!description.length} icon={<UploadOutlined />}>
          Upload Revision
        </Button>
      </Upload>
    </div>
  );
};

export default DemandUploadForm;
