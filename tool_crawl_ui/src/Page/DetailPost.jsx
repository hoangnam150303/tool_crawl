import React, { useEffect, useState } from "react";
import { Card, Tag, Typography, Button, Spin, message } from "antd";
import { LeftOutlined, LinkOutlined } from "@ant-design/icons";
import postApi from "../Hooks/postApi";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import NavBar from "../Components/NavBar";
const { Title, Text, Paragraph, Link } = Typography;

const DetailPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPostById = async () => {
    try {
      const response = await postApi.getPost(id);
      setPost(response.data);
    } catch (error) {
      message.error("Failed to load post data.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPostById();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        No post found.
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div
        className="p-6 max-w-6xl mx-auto"
        style={{ backgroundColor: "#B4C3C059", height: "100vh" }}
      >
        {/* Back button */}
        <div
          className="mb-4 flex justify-between items-center"
          style={{ marginBottom: "20px", marginTop: "20px" }}
        >
          <Button
            icon={<LeftOutlined />}
            type="default"
            style={{ backgroundColor: "#19A891", borderColor: "#19A891" }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>

        <div className="flex gap-4 items-start">
          {/* Image */}
          <div>
            <img
              src={post.imageUrl}
              alt="Post"
              style={{ height: "300px", width: "300px", margin: "0 " }}
            />
          </div>

          {/* Title & Link */}
          <div className="flex-1">
            <Card
              className="bg-gray-50 border-gray-300"
              bodyStyle={{ padding: "16px" }}
            >
              <div className="flex justify-between items-start">
                <Paragraph
                  className="whitespace-pre-wrap mb-0 font-medium"
                  style={{ height: "400px" }}
                >
                  {post.title || "No title"}
                </Paragraph>
                {post.articleUrl && (
                  <Link
                    href={post.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkOutlined className="text-xl ml-2" />
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8" style={{ marginBottom: "200px" }}>
          <Title
            level={5}
            className="text-teal-700 uppercase tracking-wide"
            style={{ marginBottom: "16px", color: "#19A891" }}
          >
            Information
          </Title>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 mt-2">
            <div>
              <Text strong>Platform:</Text>{" "}
              <Tag color="blue">{post.platform}</Tag>
            </div>
            <div>
              <Text strong>Published Date:</Text>{" "}
              <Text>{dayjs(post.date).format("YYYY-MM-DD HH:mm")}</Text>
            </div>
            <div>
              <Text strong>Crawled At:</Text>{" "}
              <Text>{dayjs(post.crawledAt).format("YYYY-MM-DD HH:mm")}</Text>
            </div>
            <div>
              <Text strong>Post ID:</Text> <Text copyable>{post._id}</Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPost;
