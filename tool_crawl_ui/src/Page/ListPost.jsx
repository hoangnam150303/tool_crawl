import React, { useState, useRef } from "react";
import { Table, Input, Tag, Button, Upload, message } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import postApi from "../Hooks/postApi";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
export const ListPost = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [uploadedJson, setUploadedJson] = useState([]);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const postCrawl = async () => {
    setLoading(true);
    try {
      const response = await postApi.postCrawl({ urls: searchText });
      setPosts(response.data || []);
    } catch (error) {
      console.log("Error during post crawl:", error);
      message.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (Array.isArray(json)) {
          setUploadedJson(json);
          message.success("File loaded successfully!");
        } else {
          message.error("JSON file must contain an array of posts.");
        }
      } catch (err) {
        message.error("Invalid JSON file.");
      }
    };
    console.log(file);

    reader.readAsText(file);
    return false; // prevent upload
  };

  const handleApplyJson = () => {
    setPosts(uploadedJson.map((p, idx) => ({ ...p, key: idx })));
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => {
        const maxLength = 100;
        const shortText =
          text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;

        return <span title={text}>{shortText || "No title"}</span>;
      },
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      render: (platform) => <Tag color="blue">{platform}</Tag>,
    },
    {
      title: "Image",
      key: "imageUrl",
      render: (_, record) => (
        <div className="flex items-center max-w-[80px] max-h-[80px] overflow-hidden">
          <img
            src={record.imageUrl}
            alt="post"
            className="w-16 h-16 object-cover rounded"
          />
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Link",
      dataIndex: "articleUrl",
      key: "articleUrl",
      render: (url) => (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View
        </a>
      ),
    },
  ];

  return (
    <>
      <NavBar />
      <div className="p-4">
        <div className="flex gap-2 mb-4 items-center">
          <Input
            placeholder="Enter URL(s)..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-96"
          />
          <Button type="primary" onClick={postCrawl}>
            Search
          </Button>
        </div>

        <div className="flex gap-2 mb-4 items-center">
          <Upload
            beforeUpload={handleFileUpload}
            showUploadList={false}
            accept=".json"
          >
            <Button icon={<UploadOutlined />}>Upload JSON</Button>
          </Upload>

          <Button
            onClick={handleApplyJson}
            disabled={uploadedJson.length === 0}
          >
            Apply
          </Button>
        </div>

        <Table
          dataSource={posts.map((p, idx) => ({ ...p, key: idx }))}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 6 }}
          scroll={{ x: "max-content" }}
          bordered
          onRow={(record) => ({
            onClick: () => {
              if (record._id) {
                navigate(`/post/${record._id}`);
              } else {
                message.warning("Post ID is missing.");
              }
            },
          })}
        />
      </div>
    </>
  );
};
