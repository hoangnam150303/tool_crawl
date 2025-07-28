const Post = require("../models/Post");
const Process = require("../models/Process");
exports.getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("advertiser_id", "name email") // populate thông tin người đăng nếu cần
      .populate("process_id") // populate process nếu cần
      .sort({ createdAt: -1 }); // sắp xếp bài viết mới nhất lên đầu

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Get all posts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve posts",
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { postId, moderator_id } = req.params;
    const { status } = req.body;
    // Kiểm tra trạng thái hợp lệ
    const allowedStatuses = ["Pending", "Reviewed", "Violation", "Resolved"];
    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    // Tìm post
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Tìm process liên quan và cập nhật
    const process = await Process.findById(post.process_id);
    if (!process) {
      return res
        .status(404)
        .json({ success: false, message: "Process not found" });
    }
    post.reviewed_by = moderator_id;
    post.save();

    process.currentStatus = status;
    process.statusDates[status] = new Date();
    await process.save();

    return res
      .status(200)
      .json({ success: true, message: "Process updated", data: process });
  } catch (error) {
    console.error("Update process error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
