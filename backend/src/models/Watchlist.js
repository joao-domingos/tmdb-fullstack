import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tmdbId: { type: Number, required: true },
    title: { type: String, required: true, trim: true, maxlength: 300 },
    posterPath: { type: String, default: null },
    year: { type: Number, default: null, min: 1887, max: 2200 },
    rating: { type: Number, default: 0, min: 0, max: 10 },
    note: { type: String, default: '', maxlength: 500 },
    watched: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// No duplicates: same user cannot add the same movie twice.
watchlistSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });
// Text index for note/title search.
watchlistSchema.index({ title: 'text', note: 'text' });

export const Watchlist = mongoose.model('Watchlist', watchlistSchema);
