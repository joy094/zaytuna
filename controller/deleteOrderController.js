// order delete controller
import orderModel from "../model/orderModel.js";


export const deleteOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    await orderModel.findByIdAndDelete(orderId);
    res.status(200).send({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting order",
      error,
    });
  }
};