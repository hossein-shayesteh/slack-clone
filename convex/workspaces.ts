import { mutation, query } from "./_generated/server";
import { authorizeAdmin } from "./utils/authorize-admin";
import { generatedCode } from "./utils/generated-code";
import { isUserMemberOfWorkspace } from "./utils/is-user-member-of-workspace";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const get = query({
  args: {},

  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    // Get all Workspaces the user is associated with
    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = members.map((members) => members.workspaceId);

    // Use Promise.all to fetch all workspaces in parallel
    return await Promise.all(
      workspaceIds.map((workspaceId) => ctx.db.get(workspaceId)),
    );
  },
});

export const getById = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const member = await isUserMemberOfWorkspace(ctx, args.id);

    if (!member) return null;

    return (await ctx.db.get(member.workspaceId)) || null;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("Unauthorized");

    const joinCode = generatedCode();

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });

    await ctx.db.insert("members", { userId, workspaceId, role: "admin" });
    await ctx.db.insert("channels", { name: "general", workspaceId });

    return await ctx.db.get(workspaceId);
  },
});

export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },

  handler: async (ctx, args) => {
    await authorizeAdmin(ctx, args.id);

    await ctx.db.patch(args.id, { name: args.name });

    return await ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },

  handler: async (ctx, args) => {
    await authorizeAdmin(ctx, args.id);

    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
      .collect();

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
      .collect();

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    for (const channel of channels) {
      await ctx.db.delete(channel._id);
    }

    //Keep a copy of deleted workspace
    const workspaces = await ctx.db.get(args.id);

    //Delete workspace
    await ctx.db.delete(args.id);

    return workspaces;
  },
});

export const updateJoinCode = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    await authorizeAdmin(ctx, args.id);

    const newJoinCode = generatedCode();

    await ctx.db.patch(args.id, { joinCode: newJoinCode });

    return await ctx.db.get(args.id);
  },
});
