import { mutation, query } from "./_generated/server";
import { authorizeAdmin, isUserMemberOfWorkspace } from "./utlis";
import { v } from "convex/values";

export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },

  handler: async (ctx, args) => {
    const member = await isUserMemberOfWorkspace({
      ctx,
      workspaceId: args.workspaceId,
    });
    if (!member) return null;

    return await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId),
      )
      .collect();
  },
});

export const getById = query({
  args: {
    id: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const channel = await ctx.db.get(args.id);
    if (!channel) return null;

    const member = await isUserMemberOfWorkspace({
      ctx,
      workspaceId: channel.workspaceId,
    });
    if (!member) return null;

    return channel;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    await authorizeAdmin({ ctx, workspaceId: args.workspaceId });

    const parsedName = args.name.replace(/\s+/g, "-").toLowerCase();

    const channelId = await ctx.db.insert("channels", {
      name: parsedName,
      workspaceId: args.workspaceId,
    });

    return await ctx.db.get(channelId);
  },
});

export const update = mutation({
  args: {
    id: v.id("channels"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const channel = await ctx.db.get(args.id);
    if (!channel) throw new Error("Channel not found");

    await authorizeAdmin({ ctx, workspaceId: channel.workspaceId });

    const parsedName = args.name.replace(/\s+/g, "-").toLowerCase();

    await ctx.db.patch(args.id, { name: parsedName });

    return await ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: {
    id: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const channel = await ctx.db.get(args.id);
    if (!channel) throw new Error("Channel not found");

    await authorizeAdmin({ ctx, workspaceId: channel.workspaceId });

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_channel_id", (q) => q.eq("channelId", channel._id))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    await ctx.db.delete(args.id);

    return channel;
  },
});
