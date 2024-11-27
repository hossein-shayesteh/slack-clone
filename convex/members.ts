import { query } from "./_generated/server";
import { isUserMemberOfWorkspace, populateUser } from "./utlis";
import { getAuthUserId } from "@convex-dev/auth/server";
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

    const users = [];

    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId),
      )
      .collect();

    for (const member of members) {
      const user = await populateUser({ ctx, userId: member.userId });
      if (user) users.push({ ...member, user });
    }
    return users;
  },
});

export const current = query({
  args: {
    workspaceId: v.id("workspaces"),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    return await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();
  },
});
