// controllers/noticeController.js
import noticeModel from "../model/noticeModel.js";

// ১. নোটিশ তৈরি করার কন্ট্রোলার
export const createNoticeController = async (req, res) => {
  try {
    const { title, content, category, tag, date, status } = req.body;

    // ভ্যালিডেশন
    if (!title) return res.send({ error: "Title is required" });
    if (!content) return res.send({ error: "Content is required" });
    if (!category) return res.send({ error: "Category is required" });
    if (!tag) return res.send({ error: "Tag is required" });
    if (!date) return res.send({ error: "Date is required" });

    // ডাটাবেজে সেভ করা
    const notice = await new noticeModel({
      title,
      content,
      category,
      tag,
      date,
      status: status || "Active",
    }).save();

    res.status(201).send({
      success: true,
      message: "Notice Created Successfully",
      notice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating notice",
    });
  }
};

// ২. সব নোটিশ ফেচ করার কন্ট্রোলার (ফ্রন্টএন্ডে দেখানোর জন্য)
export const getNoticesController = async (req, res) => {
  try {
    // নতুন নোটিশ আগে দেখানোর জন্য createdAt: -1
    const notices = await noticeModel.find({}).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All notices fetched successfully",
      notices,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting notices",
    });
  }
};

// ৩. নোটিশ ডিলিট করার কন্ট্রোলার
export const deleteNoticeController = async (req, res) => {
  try {
    const { id } = req.params;
    await noticeModel.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Notice Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in deleting notice",
    });
  }
};

// ৪. নোটিশ আপডেট করার কন্ট্রোলার
export const updateNoticeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, tag, date, status } = req.body;

    const updatedNotice = await noticeModel.findByIdAndUpdate(
      id,
      { title, content, category, tag, date, status },
      { new: true },
    );

    res.status(200).send({
      success: true,
      message: "Notice Updated Successfully",
      notice: updatedNotice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating notice",
    });
  }
};
