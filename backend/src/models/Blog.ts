import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  summary?: string;
  image?: string;
  author: mongoose.Schema.Types.ObjectId;
  tags: string[];
  category: string;
  likes: mongoose.Schema.Types.ObjectId[];
  comments: {
    _id: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    text: string;
    name: string;
    avatar?: string;
    date: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    summary: {
      type: String,
      maxlength: [200, 'Summary cannot be more than 200 characters'],
    },
    image: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Technology',
        'Programming',
        'Design',
        'Business',
        'Lifestyle',
        'Health',
        'Other',
      ],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        avatar: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create index for search functionality
BlogSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model<IBlog>('Blog', BlogSchema); 