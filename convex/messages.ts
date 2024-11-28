import { mutation } from "./_generated/server";
import { isUserMemberOfWorkspace } from "./utlis";
import { v } from "convex/values";

export const create = mutation({
  args: {
    body: v.string(),
    workspaceId: v.id("workspaces"),
    image: v.optional(v.id("_storage")),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const member = await isUserMemberOfWorkspace({
      ctx,
      workspaceId: args.workspaceId,
    });
    if (!member) throw new Error("Unauthorized");

    let _conversationId = args.conversationId;

    // Only possible if we are replying in a thread in 1:1 conversation
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) throw new Error("Parent message not found.");

      _conversationId = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert("messages", {
      body: args.body,
      image: args.image,
      memberId: member._id,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      parentMessageId: args.parentMessageId,
      conversationId: _conversationId,
      updatedAt: new Date().getTime(),
    });

    return await ctx.db.get(messageId);
  },
});
