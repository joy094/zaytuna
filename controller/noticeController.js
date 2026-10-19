// controllers/noticeController.js
import noticeModel from "../model/noticeModel.js";

// নোটিশ তৈরি করার কন্ট্রোলার
export const createNoticeController = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // ভ্যালিডেশন
    if (!title) {
      return res.send({ error: "Title is required" });
    }
    if (!description) {
      return res.send({ error: "Description is required" });
    }

    // ডাটাবেজে সেভ করা
    const notice = await new noticeModel({
      title,
      description,
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

// সব নোটিশ দেখার জন্য (অপশনাল, ফ্রন্টএন্ডে দেখানোর জন্য কাজে লাগবে)
export const getNoticesController = async (req, res) => {
  try {
    const notices = await noticeModel.find({}).sort({ createdAt: -1 }); // নতুন নোটিশ আগে দেখাবে
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

// নোটিশ ডিলিট করার কন্ট্রোলার
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

// নোটিশের স্ট্যাটাস বা তথ্য আপডেট করার কন্ট্রোলার
export const updateNoticeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const updatedNotice = await noticeModel.findByIdAndUpdate(
      id,
      { title, description, status },
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
