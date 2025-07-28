const axios = require("axios");
const Post = require("../models/Post");
const Process = require("../models/Process");

exports.validateAdvertiser = async (req, res) => {
  try {
    const { text } = req.body;
    const advertiser_id = req.params.id;
    const image = req.file.path;
    const validPost = await Post.findOne({
      content: { text },
    });

    if (validPost) {
      const formatted = [
        {
          id: validPost._id,
          caption: validPost.content?.text || "",
          url_img: validPost.image?.url || "",
        },
      ];

      const fileContent = {
        data: formatted,
      };
      console.log(fileContent);

      const aiRes = await axios.post(process.env.AI_API, fileContent, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(aiRes.data.results[0].Image_Violation);
      validPost.content.label = aiRes.data.results[0].Violation.has_violation;
      validPost.image.label =
        aiRes.data.results[0].Image_Violation.has_violation;
      validPost.save();
      return res.status(201).json({
        success: true,
        data: validPost,
        ai_result: aiRes.data,
      });
    }

    // 1. Tạo process mới
    const newProcess = await Process.create({
      statusDates: {
        Pending: new Date(),
      },
      currentStatus: "Pending",
    });

    // 2. Tạo post mới
    const post = await Post.create({
      advertiser_id,
      process_id: newProcess._id,
      content: { text },
      image: { url: image },
    });

    if (post) {
      const formatted = [
        {
          id: post._id,
          caption: post.content?.text || "",
          url_img: post.image?.url || "",
        },
      ];

      const fileContent = {
        data: formatted,
      };
      console.log(fileContent);

      const aiRes = await axios.post(process.env.AI_API, fileContent, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return res.status(201).json({
        success: true,
        data: post,
        ai_result: aiRes.data,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
