import { type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { idempotencyKeysTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { AuthenticatedRequest } from "./requireAuth";

export const idempotencyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const method = req.method.toUpperCase();
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return next();
  }

  const authReq = req as AuthenticatedRequest;
  const userId = authReq.userId;
  if (!userId) {
    // Rely on requireAuth for actual authentication; if no user, just pass through or wait for requireAuth to catch it
    return next();
  }

  const idempotencyKey = req.headers["idempotency-key"] as string | undefined;

  if (!idempotencyKey) {
    res.status(400).json({ error: "Idempotency-Key header is required" });
    return;
  }

  try {
    // Attempt to insert the idempotency key to get an exclusive lock on this token
    await db.insert(idempotencyKeysTable).values({
      key: idempotencyKey,
      userId,
      requestMethod: method,
      requestPath: req.originalUrl || req.url,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (err: any) {
    // If the insert fails due to a unique constraint violation, the key already exists
    if (err.code === "23505" || err.message.includes("unique constraint")) {
      try {
        const [existing] = await db
          .select()
          .from(idempotencyKeysTable)
          .where(eq(idempotencyKeysTable.key, idempotencyKey));

        if (existing) {
          if (existing.userId !== userId) {
            res.status(400).json({ error: "Idempotency key mismatch: User ID differs" });
            return;
          }

          if (existing.responseStatus) {
             res.status(existing.responseStatus).json(existing.responseBody);
             return;
          } else {
             // In progress
             res.status(409).json({ error: "Request is currently processing" });
             return;
          }
        }
      } catch (findErr) {
        req.log.error({ err: findErr }, "idempotency.find_error");
        res.status(500).json({ error: "Internal server error" });
        return;
      }
    } else {
       req.log.error({ err }, "idempotency.insert_error");
       res.status(500).json({ error: "Internal server error" });
       return;
    }
  }

  // Override res.json and res.send to capture the response
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  res.json = (body: any): Response => {
    saveResponse(idempotencyKey, res.statusCode, body).catch(e => req.log.error({ err: e }, "idempotency.save_error"));
    return originalJson(body);
  };

  res.send = (body: any): Response => {
    // Only intercept if we haven't already and the response is JSON-like (or for 204 which has empty body)
    if (typeof body === "string" || body instanceof Buffer || body === undefined) {
      let parsedBody = body;
      if (typeof body === 'string') {
        try {
           parsedBody = JSON.parse(body);
        } catch {
           parsedBody = { text: body };
        }
      } else if (body === undefined) {
         parsedBody = null;
      }
      saveResponse(idempotencyKey, res.statusCode, parsedBody).catch(e => req.log.error({ err: e }, "idempotency.save_error"));
    }
    return originalSend(body);
  };

  next();
};

async function saveResponse(key: string, status: number, body: any) {
   try {
     await db.update(idempotencyKeysTable)
        .set({
           responseStatus: status,
           responseBody: body,
           updatedAt: new Date(),
        })
        .where(eq(idempotencyKeysTable.key, key));
   } catch (e) {
      console.error("Failed to save idempotency response", e);
   }
}
