"use client";

import { IPost, IUser } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { sliceText } from '@/lib/utils';
import {formatDistanceToNowStrict} from 'date-fns';
import { AiFillDelete, AiOutlineMessage } from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'sonner';
import axios from 'axios';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';

interface Props {
	post: IPost;
	user: IUser;
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

export const PostItem = ({ post, user, setPosts }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onDelete = async (e: any) => {
    e.stopPropagation();
    try {
        setIsLoading(true);
        // DELETE POST
        await axios.delete(`/api/posts?limit=10`, {data: {
            postId: post._id,
        }});

        setPosts((prev) => prev.filter((p) => p._id !== post._id));
        setIsLoading(false);

        toast("Deleted successfully!");
    } catch (error) {
        setIsLoading(false);
        return toast("Something went wrong. Please try again.");
    }
  };

  const onLike = async (e: any) => {
    e.stopPropagation();
    try {
        setIsLoading(true);
        console.log(post);

        if(post.hasLiked) {
            // DELETE LIKE
            await axios.delete(`/api/likes`, {
                data: {
                    postId: post._id,
                    userId: user._id,
                }
            });

            const updatedPosts = {
                ...post, 
                hasLiked: false, 
                likes: post.likes - 1,
            };

            setPosts((prev) => 
                prev.map((p) => (p._id === post._id ? updatedPosts : p))
            );
        } else {
            await axios.put(`/api/likes`, {
                postId: post._id,   
                userId: user._id,
            });

            const updatedPosts = {
                ...post, 
                hasLiked: true,
                likes: post.likes + 1,
            };

            setPosts((prev) =>
                prev.map((p) => (p._id === post._id ? updatedPosts : p))
            );            
        }        

        setIsLoading(false);
    } catch (error) {
        setIsLoading(false);
        return toast("Something went wrong. Please try again.");
    }
  }

  const goToPost = () => {
    router.push(`/posts/${post._id}`);
  }
  
  return (
    <div className='border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition relative'>
        {isLoading && (
            <div className='absolute inset-0 w-full h-full bg-black opacity-50'>
                <div className='flex justify-center items-center h-full'>
                    <Loader2 className='animate-spin text-sky-500' />
                </div>
            </div>
        )}
        <div className='flex flex-row items-center gap-3 cursor-pointer' onClick={goToPost}>
            <Avatar>
                <AvatarImage src={post.user.profileImage} />
                <AvatarFallback>{post.user.name[0]}</AvatarFallback>
            </Avatar>

            <div>
                <div className='flex flex-row items-center gap-2'>
                    <p className='text-white font-semibold cursor-pointer hover:underline'>{post.user.name}</p>
                    <span className='text-neutral-500 cursor-pointer hover:underline hidden md:block'>
                        {post.user.username ? `@${sliceText(post.user.username, 16)}` : sliceText(post.user.email, 16)}
                    </span>
                    <span className='text-neutral-500 text-sm'>{formatDistanceToNowStrict(new Date(post.createdAt))} ago</span>
                </div>

                <div className='text-white mt-1'>{post.body}</div>

                <div className='flex flex-row items-center mt-3 gap-10'>
                    <div className='flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-sky-500'>
                        <AiOutlineMessage size={20} />
                        <p>{post.comments || 0}</p>
                    </div>

                    <div
                        className={`flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500`}
                        onClick={onLike}
                        role='button'
                    >
                        <FaHeart size={20} color={post.hasLiked ? 'red' : ''} />
                        <p>{post.likes || 0}</p>
                    </div>

                    {post.user._id === user._id && (
                        <div
                            className={`flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500`}
                            onClick={onDelete}
                            role='button'
                        >
                            <AiFillDelete size={20} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
