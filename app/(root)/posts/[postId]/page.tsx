'use client';

import CommentItem from '@/components/shared/comment-item';
import { Form } from '@/components/shared/form';
import { Header } from '@/components/shared/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { sliceText } from '@/lib/utils';
import { IPost } from '@/types';
import axios from 'axios';
import { formatDistanceToNowStrict } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const { postId } = useParams();
  const { data: session, status }: any = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingComment, setIsFetchingComment] = useState(false);
  const [post, setPost] = useState<IPost | null>(null);
  const [comments, setComments] = useState<IPost[]>([]);

  const getPost = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/api/posts/${postId}`);
      setPost(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getComments = async () => {
    try {
      setIsFetchingComment(true);
      const { data } = await axios.get(`/api/posts/${postId}/comments`);
      setComments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchingComment(false);
    }
  };

  useEffect(() => {
    if (postId) {
      getPost();
      getComments();
    }
  }, [postId]);

  return (
    <>
      <Header label='Posts' isBack />

      {isLoading || status === 'loading' ? (
        <div className='flex justify-center items-center h-24'>
          <Loader2 className='animate-spin text-sky-500' />
        </div>
      ) : (
        <>
          <div className='border-b-[1px] border-neutral-800 p-5 cursor-pointer bg-neutral-900 transition relative'>
            <div className='flex flex-row items-center gap-3 cursor-pointer'>
              <Avatar>
                <AvatarImage src={post?.user.profileImage} />
                <AvatarFallback>{post?.user.name[0]}</AvatarFallback>
              </Avatar>

              <div>
                <div className='flex flex-row items-center gap-2'>
                  <p className='text-white font-semibold cursor-pointer hover:underline'>
                    {post?.user.name}
                  </p>
                  <span className='text-neutral-500 cursor-pointer hover:underline hidden md:block'>
                    {post && post?.user.username
                      ? `@${sliceText(post.user.username, 20)}`
                      : post && sliceText(post.user.email, 20)}
                  </span>
                  <span className='text-neutral-500 text-sm'>
                    {post?.createdAt &&
                      formatDistanceToNowStrict(new Date(post.createdAt))}
                  </span>
                </div>

                <div className='text-white mt-1'>{post?.body}</div>
              </div>
            </div>
          </div>

          <Form
            placeholder='Post your reply?'
            user={session?.currentuser}
            setPosts={setComments}
            postId={postId}
            isComment
          />

          {isFetchingComment ? (
            <div className='flex justify-center items-center h-24'>
              <Loader2 className='animate-spin text-sky-500' />
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem comment={comment} key={comment._id} />
            ))
          )}
        </>
      )}
    </>
  );
};

export default Page;
