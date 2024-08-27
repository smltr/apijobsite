import { Handlers } from "$fresh/server.ts";
import { Posting } from "../../types/index.ts";

const clients = new Set<ReadableStreamDefaultController>();

export const handler: Handlers = {
  GET(_req) {
    const body = new ReadableStream({
      start(controller) {
        clients.add(controller);
        controller.enqueue("data: connected\n\n");
      },
      cancel() {
        clients.delete(this);
      },
    });

    return new Response(body.pipeThrough(new TextEncoderStream()), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  },
};

export function broadcast(posting: Posting) {
  const message = `data: ${JSON.stringify(posting)}\n\n`;
  clients.forEach((client) => client.enqueue(message));
}
