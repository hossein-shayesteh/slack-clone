import { mutation, query } from "./_generated/server";
import {
  authorizeAdmin,
  generatedCode,
  isUserMemberOfWorkspace,
} from "./utlis";
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
    const member = await isUserMemberOfWorkspace({ ctx, workspaceId: args.id });

    if (!member) return null;

    return (await ctx.db.get(member.workspaceId)) || null;
  },
});

export const getInfoById = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId),
      )
      .unique();

    const workspace = await ctx.db.get(args.id);

    return {
      name: workspace?.name,
      isMember: !!member,
    };
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
    await authorizeAdmin({ ctx, workspaceId: args.id });

    await ctx.db.patch(args.id, { name: args.name });

    return await ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },

  handler: async (ctx, args) => {
    await authorizeAdmin({ ctx, workspaceId: args.id });

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
    await authorizeAdmin({ ctx, workspaceId: args.id });

    const newJoinCode = generatedCode();

    await ctx.db.patch(args.id, { joinCode: newJoinCode });

    return await ctx.db.get(args.id);
  },
});

export const join = mutation({
  args: {
    id: v.id("workspaces"),
    joinCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const workspace = await ctx.db.get(args.id);
    if (!workspace) throw new Error("Workspace not found.");

    if (workspace.joinCode !== args.joinCode.toLowerCase())
      throw new Error("Invalid join code.");

    //Check if user is a member of the workspace
    const existingMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId),
      )
      .unique();

    if (existingMember)
      throw new Error("User is already a member of this workspace");

    await ctx.db.insert("members", {
      userId,
      workspaceId: workspace._id,
      role: "member",
    });

    return await ctx.db.get(args.id);
  },
});
