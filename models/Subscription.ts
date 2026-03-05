import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISubscription extends Document {
  userId: string
  stripeCustomerId: string
  subscriptionId: string
  planType: 'pro' | 'business'
  status: 'active' | 'cancelled' | 'expired'
  expiryDate: Date
  createdAt: Date
  updatedAt: Date
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    stripeCustomerId: { type: String, required: true },
    subscriptionId: { type: String, required: true },
    planType: { type: String, enum: ['pro', 'business'], required: true },
    status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
)

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>('Subscription', SubscriptionSchema)

export default Subscription
