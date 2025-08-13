import mongoose, { Schema, Types } from "mongoose";

const MenuItemSchema = new Schema({
  id: Number,
  title: String,
  url: String,
  order: Number,
  visible: Boolean,
  target: { type: String, default: "_self" },
});

const SiteSchema = new Schema(
  {
    menu: [MenuItemSchema],
    sliders: [{ type: Schema.Types.ObjectId, ref: "Slider" }],
    announcementsBlock: {
      limit: { type: Number, default: 6 },
      enabled: { type: Boolean, default: true },
      title: String,
    },
    eventsBlock: {
      limit: { type: Number, default: 6 },
      enabled: { type: Boolean, default: true },
      title: String,
    },
    hero: {
      slides: [{ type: Schema.Types.ObjectId, ref: "Slider" }],
    },
    footer: {
      html: String,
      links: [{ label: String, url: String }],
    },
    social: [{ name: String, url: String, icon: String }],
    settings: Schema.Types.Mixed,
    pages: Schema.Types.Mixed,
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Site || mongoose.model("Site", SiteSchema);
