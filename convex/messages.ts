import { mutation } from "./_generated/server";
import { isUserMemberOfWorkspace } from "./utlis";
import { v } from "convex/values";

export const create = mutation({
  args: {
    body: v.string(),
    workspaceId: v.id("workspaces"),
    image: v.optional(v.id("_storage")),
    channelId: v.optional(v.id("channels")),
    parentMessage: v.optional(v.id("messages")),
    // TODO: add conversation Id
  },
  handler: async (ctx, args) => {
    const member = await isUserMemberOfWorkspace({
      ctx,
      workspaceId: args.workspaceId,
    });
    if (!member) throw new Error("Unauthorized");

    const messageId = await ctx.db.insert("messages", {
      body: args.body,
      image: args.image,
      memberId: member._id,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      parentMessage: args.parentMessage,
      updatedAt: new Date().getTime(),
    });

    return await ctx.db.get(messageId);
  },
});
