import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import {
  isUserMemberOfWorkspace,
  populateMember,
  populateReactions,
  populateThread,
  populateUser,
} from "./utlis";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    let _conversationId = args.conversationId;

    if (!args.channelId && !args.conversationId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) throw new Error("Parent message not found.");

      _conversationId = parentMessage.conversationId;
    }

    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_conversation_id_parent_message_id", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("conversationId", _conversationId)
          .eq("parentMessageId", args.parentMessageId),
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const page = (
      await Promise.all(
        results.page.map(async (message) => {
          const member = await populateMember({
            ctx,
            memberId: message.memberId,
          });
          const user = member
            ? await populateUser({ ctx, userId: member.userId })
            : null;
          // If member or user is not found, exclude the message from the results
          if (!member || !user) return null;

          const reactions = await populateReactions({
            ctx,
            messageId: message._id,
          });

          const reactionWithCounts = reactions.map((reaction) => ({
            ...reaction,
            count: reactions.filter((r) => r.value === reaction.value).length,
          }));

          const dedupedReactions = reactionWithCounts.reduce(
            (acc, reaction) => {
              const existingReaction = acc.find(
                (r) => r.value === reaction.value,
              );

              if (existingReaction)
                existingReaction.memberIds = Array.from(
                  new Set([...existingReaction.memberIds, reaction.memberId]),
                );
              else acc.push({ ...reaction, memberIds: [reaction.memberId] });

              return acc;
            },
            [] as (Doc<"reactions"> & {
              count: number;
              memberIds: Id<"members">[];
            })[],
          );

          const reactionWithoutMemberProperty = dedupedReactions.map(
            ({ memberId, ...rest }) => rest,
          );

          const thread = await populateThread({
            ctx,
            messageId: message._id,
          });
          const image = message.image
            ? await ctx.storage.getUrl(message.image)
            : null;

          return {
            ...message,
            image,
            member,
            user,
            reactions: reactionWithoutMemberProperty,
            threadCount: thread.count,
            threadImage: thread.image,
            threadTimestamp: thread.timestamp,
          };
        }),
      )
    ).filter((message) => message !== null);

    return {
      ...results,
      page: page as NonNullable<typeof page>,
    };
  },
});

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
    });

    return await ctx.db.get(messageId);
  },
});
