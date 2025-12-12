import Pusher from "pusher";
import PusherClient from "pusher-js";

// Server-side Pusher instance
export const pusherServer = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
});

// Client-side Pusher instance (singleton)
let pusherClientInstance: PusherClient | null = null;

export const getPusherClient = () => {
    if (typeof window === "undefined") {
        return null;
    }

    if (!pusherClientInstance) {
        pusherClientInstance = new PusherClient(
            process.env.NEXT_PUBLIC_PUSHER_KEY!,
            {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            }
        );
    }

    return pusherClientInstance;
};

// Channel naming conventions - using public channels (no auth required)
export const getConversationChannel = (conversationId: string) =>
    `conversation-${conversationId}`;

export const getUserChannel = (userId: string) =>
    `user-${userId}`;

export const getCompanyChannel = (companyId: string) =>
    `company-${companyId}`;
