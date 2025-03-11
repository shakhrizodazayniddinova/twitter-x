import Post from "@/database/post-modal";
import User from "@/database/user.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// POST FUNCTION
export async function POST(req:Request) {
    try {
        await connectToDatabase();

        const {body, userId} = await req.json();
        const post = await Post.create({body, user: userId});

        return NextResponse.json(post);
    } catch (error) {
        const result = error as Error;
        return NextResponse.json({error: result.message}, {status: 400});
    }
}

// GET FUNCTION
export async function GET(req:Request) {
    try {
        await connectToDatabase();

        const {currentuser}: any = await getServerSession(authOptions);

        const {searchParams} = new URL(req.url);
        const limit = searchParams.get("limit");

        const posts = await Post.find({})
          .populate({
            path: "user",
            model: User,
            select: "name email profileImage _id username",
          })
          .limit(Number(limit))
          .sort({ createdAt: -1 });

        const filteredPosts = posts.map(post => ({
            body: post.body,
            createdAt: post.createdAt,
            user: {
                _id: post.user._id,
                name: post.user.name,
                email: post.user.email,
                profileImage: post.user.profileImage,
                username: post.user.username,
            },
            likes: Array.isArray(post.likes) ? post.likes.length : 0,
            comments: Array.isArray(post.comments) ? post.comments.length : 0,
            hasLiked: Array.isArray(post.likes) && post.likes.includes(currentuser._id),
            _id: post._id,
        }));

        console.log(filteredPosts);

        return NextResponse.json(filteredPosts);
    } catch (error) {
        const result = error as Error;
        return NextResponse.json({error: result.message}, {status: 400});
    }
}

// DELETE FUNCTION
export async function DELETE(req:Request) {
    try {
        await connectToDatabase();
        const {postId, userId} = await req.json();

        await Post.findByIdAndDelete(postId);

        return NextResponse.json({message: "Post deleted successfully"});
    } catch (error) {
        const result = error as Error;
        return NextResponse.json({error: result.message}, {status: 400});
    }
}