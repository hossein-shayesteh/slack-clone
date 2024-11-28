import { Id } from "./_generated/dataModel";
import { QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generatedCode = () => {
  return Array.from(
    { length: 6 },
    () =>
      "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)],
  ).join("");
};

export const populateUser = async ({
  ctx,
  userId,
}: {
  ctx: QueryCtx;
  userId: Id<"users">;
}) => {
  return ctx.db.get(userId);
};

export const populateMember = async ({
  ctx,
  memberId,
}: {
  ctx: QueryCtx;
  memberId: Id<"members">;
}) => {
  return ctx.db.get(memberId);
};

export const populateReactions = async ({
  ctx,
  messageId,
}: {
  ctx: QueryCtx;
  messageId: Id<"messages">;
}) => {
  return await ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

export const populateThread = async ({
  ctx,
  messageId,
}: {
  ctx: QueryCtx;
  messageId: Id<"messages">;
}) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) =>
      q.eq("parentMessageId", messageId),
    )
    .collect();

  if (messages.length === 0)
    return { count: 0, image: undefined, timestamp: 0 };

  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember({
    ctx,
    memberId: lastMessage.memberId,
  });

  if (!lastMessageMember) return { count: 0, image: undefined, timestamp: 0 };

  const lastMessageUser = await populateUser({
    ctx,
    userId: lastMessageMember.userId,
  });

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage._creationTime,
  };
};

export const authorizeAdmin = async ({
  ctx,
  workspaceId,
}: {
  ctx: QueryCtx;
  workspaceId: Id<"workspaces">;
}) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthorized");

  const member = await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId),
    )
    .unique();
  if (!member || member.role !== "admin") throw new Error("Unauthorized");

  return member;
};

export const isUserMemberOfWorkspace = async ({
  workspaceId,
  ctx,
}: {
  ctx: QueryCtx;
  workspaceId: Id<"workspaces">;
}) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;

  const member = await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId),
    )
    .unique();
  if (!member) return null;

  return member;
};
