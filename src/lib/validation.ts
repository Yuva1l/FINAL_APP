import { z } from 'zod'

/*
 * Centralised request payload validation schemas used by the API routes.
 * These schemas enforce the expected shape and type of incoming data and
 * provide helpful error messages when validation fails. Each schema
 * returns a typed result which can be safely used after parsing.
 */

// Login credentials must include a valid email and a password of at least six characters
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

// Event creation requires basic details about the event and ensures the end
// date is after the start date. The slug must be kebab‑case and within a
// reasonable length.
export const EventCreateSchema = z.object({
  title: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9-]+$/).min(3).max(48),
  description: z.string().min(10),
  location: z.string().min(2),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  // Optional cover image URL; if provided it must be a valid URL
  coverUrl: z.string().url().optional()
}).refine(d => d.endsAt > d.startsAt, {
  path: ['endsAt'],
  message: 'endsAt must be after startsAt'
})

// Tickets must belong to an event and specify a name, price in minor units and
// available quantity. Prices cannot be negative and quantity must be at least one.
export const TicketCreateSchema = z.object({
  eventId: z.string().cuid(),
  name: z.string().min(2),
  priceMinor: z.coerce.number().int().min(0),
  quantity: z.coerce.number().int().min(1)
})

// Checkout payload ensures a valid ticket type reference, limits quantity to a
// reasonable range and optionally collects buyer details. Email and buyerName
// are optional but validated when provided.
export const CheckoutSchema = z.object({
  ticketTypeId: z.string().cuid(),
  qty: z.coerce.number().int().min(1).max(100),
  email: z.string().email().optional(),
  buyerName: z.string().min(2).optional()
})