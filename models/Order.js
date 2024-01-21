const { model, models, Schema } = require('mongoose');

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    email: String,
    city: String,
    postalCode: String,
    streetAddress: String,
    country: String,
    paid: Boolean,
    deliver: String,
    delivered: Boolean,
    canceled: Boolean,
    confirmed: Boolean,
  },
  { timestamps: true }
);

export const Order = models?.Order || model('Order', OrderSchema);
