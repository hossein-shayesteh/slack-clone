import { mutation, query } from "./_generated/server";
import { authorizeAdmin } from "./utils/authorize-admin";
import { isUserMemberOfWorkspace } from "./utils/is-user-member-of-workspace";
import { v } from "convex/values";

export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },

  handler: async (ctx, args) => {
    const member = await isUserMemberOfWorkspace(ctx, args.workspaceId);

    if (!member) return null;

    return await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId),
      )
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    await authorizeAdmin(ctx, args.workspaceId);

    const parsedName = args.name.replace(/\s+/g, "-").toLowerCase();

    const channelId = await ctx.db.insert("channels", {
      name: parsedName,
      workspaceId: args.workspaceId,
    });

    return await ctx.db.get(channelId);
  },
});
